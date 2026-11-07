import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texts, targetLang, sourceLang = 'vi' } = body as {
      texts: string[];
      targetLang: string;
      sourceLang?: string;
    };

    if (!Array.isArray(texts) || texts.length === 0 || !targetLang) {
      return NextResponse.json({ translations: [] });
    }

    const joined = texts.map((t) => t.replace(/\s+/g, ' ').trim()).join('\n');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sourceLang
    )}&tl=${encodeURIComponent(targetLang)}&dt=t`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0',
      },
      body: `q=${encodeURIComponent(joined)}`,
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Upstream translation error' }, { status: 502 });
    }

    const data = await res.json();
    if (!Array.isArray(data?.[0])) {
      return NextResponse.json({ translations: texts });
    }

    const fullTranslated = data[0].map((part: any) => part?.[0] || '').join('');
    const lines = fullTranslated.split('\n');

    if (lines.length === texts.length) {
      return NextResponse.json({
        translations: lines.map((l: string, i: number) => l.trim() || texts[i]),
      });
    }

    // Fallback: translate each string individually if newline count changed
    const individual = await Promise.all(
      texts.map(async (singleText) => {
        try {
          const singleRes = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              'User-Agent': 'Mozilla/5.0',
            },
            body: `q=${encodeURIComponent(singleText.replace(/\s+/g, ' ').trim())}`,
          });
          if (!singleRes.ok) return singleText;
          const singleData = await singleRes.json();
          if (Array.isArray(singleData?.[0])) {
            return singleData[0].map((p: any) => p?.[0] || '').join('').trim() || singleText;
          }
          return singleText;
        } catch {
          return singleText;
        }
      })
    );

    return NextResponse.json({ translations: individual });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

