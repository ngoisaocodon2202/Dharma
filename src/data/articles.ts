// 8 Bài Cẩm Nang Chuyển Hóa Tâm — Độ dài chuyên sâu (800 - 1.200 từ), trích dẫn Kinh điển & Lộ trình 3 bước thực hành
import { getArticleImage } from '@/lib/assets';

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface ArticleQuote {
  text: string;
  source: string;
}

export interface CuratedArticle {
  slug: string;
  id: string;
  title: string;
  excerpt: string;
  image: string;
  authorOrSource: string;
  category: 'Thiền đời thường' | 'Chữa lành tâm' | 'Nhân quả & Phúc báo' | 'Hiếu đạo';
  readTime: string;
  quote: ArticleQuote;
  sections: ArticleSection[];
  dailyChecklist: string[];
}

export const CURATED_ARTICLES: CuratedArticle[] = [
  {
    slug: '5-quan-niem-buoi-sang',
    id: '5-quan-niem-buoi-sang',
    title: '5 quán niệm đầu ngày giúp người cư sĩ mở rộng tâm từ và bình an',
    excerpt:
      'Mỗi sớm mai thức dậy là một cơ hội quý giá để thiết lập lại chánh niệm, gieo trồng hạt giống từ bi và trí tuệ...',
    image: getArticleImage('5-quan-niem-buoi-sang'),
    authorOrSource: 'Ban Biên Tập Dharma',
    category: 'Thiền đời thường',
    readTime: '6 phút đọc',
    quote: {
      text: 'Thức dậy ban mai, nở một nụ cười an nhiên. Hai mươi bốn giờ tinh khôi đang mở ra trước mắt, xin nguyện sống trọn vẹn từng giây và nhìn muôn loài bằng đôi mắt thương.',
      source: 'Thiền kệ Thức Dậy — Truyền thống Làng Mai',
    },
    sections: [
      {
        heading: '1. Vì sao 10 phút đầu ngày định hình tâm thế suốt 24 giờ?',
        paragraphs: [
          'Trong nhịp sống hiện đại, đa số chúng ta vừa mở mắt đã vội vã cầm lấy chiếc điện thoại, lướt qua hàng chục thông báo công việc, tin tức tiêu cực hoặc những nỗi lo toan còn dang dở từ hôm qua. Khi tâm thức vừa thức giấc đã bị kéo vào dòng xoáy bên ngoài, hệ thần kinh lập tức rơi vào trạng thái phòng vệ và căng thẳng trước cả khi ta bước xuống giường.',
          'Theo tinh thần Phật học ứng dụng, tâm con người buổi sớm ví như mảnh đất vừa được cày xới tinh sạch sau một đêm nghỉ ngơi. Hạt giống nào được gieo xuống đầu tiên — dù là sự bồn chồn, nóng nảy hay sự tỉnh thức, biết ơn — sẽ nhanh chóng nảy mầm và dẫn dắt phản ứng của ta suốt cả ngày dài. Thực hành 5 quán niệm buổi sáng không đòi hỏi người cư sĩ phải ngồi thiền hàng giờ; chỉ cần 3 đến 5 phút tĩnh lặng có ý thức cũng đủ dựng lên ngọn hải đăng chánh niệm vững chãi.',
        ],
      },
      {
        heading: '2. Năm quán niệm cốt tủy cho người cư sĩ tại gia',
        paragraphs: [
          'Quán niệm thứ nhất — Biết ơn sự sống hiện tiền: Khi hơi thở đầu tiên trong ngày chạm vào lồng ngực, hãy thầm nhắc bản thân rằng ta vẫn còn đủ duyên lành để có một ngày mới khỏe mạnh, có cơ hội sửa mình và yêu thương. Tâm tri ân tự nhiên dập tắt tâm lý phàn nàn, than trách.',
          'Quán niệm thứ hai — Phát nguyện Từ Bi: "Nguyện cho hôm nay lời nói của tôi mang lại sự mát mẻ, hành động của tôi không làm tổn thương bất kỳ sinh linh nào." Khi tâm từ được khởi lên làm gốc, ta dễ dàng mỉm cười nhường nhịn trước sự vội vã của người đi đường hay đồng nghiệp.',
          'Quán niệm thứ ba — Nhìn thấu tính Vô Thường và Kham Nhẫn: Cuộc sống vốn không bao giờ vận hành hoàn toàn theo ý riêng của một cá nhân. Chuẩn bị trước tâm thế đón nhận những việc bất như ý như cơn mưa rào thoảng qua sẽ giúp ta không nổi sân khi gặp trắc trở.',
          'Quán niệm thứ tư — Chánh Mạng và Chánh Nghiệp: Nhìn công việc mưu sinh hàng ngày không chỉ là gánh nặng cơm áo mà là một đạo tràng phụng sự. Làm tròn bổn phận với tâm chân thành, trung thực chính là đang tạo phước báu chân thật.',
          'Quán niệm thứ năm — Hồi hướng Thiện Nguyện: Trước khi bước ra khỏi nhà, khởi một ý niệm hướng thiện gửi tặng bình an đến cha mẹ, gia đình và tất cả những ai mình sắp gặp trong ngày.',
        ],
      },
      {
        heading: '3. Chuyển hóa nghi thức thường nhật thành thiền hành',
        paragraphs: [
          'Sau khi rời giường, khi rửa mặt hay pha một tách trà ấm buổi sáng, hãy thử không làm kèm bất kỳ việc gì khác. Cảm nhận dòng nước mát chạm vào da tay, lắng nghe tiếng ấm nước reo và hơi ấm lan tỏa nơi lòng bàn tay. Chính sự có mặt trọn vẹn ở những việc nhỏ nhặt nhất lại là nền tảng của định lực.',
          'Nếu lỡ có một buổi sáng bận rộn quên thực hành, người tu không tự trách móc mà chỉ nhẹ nhàng mỉm cười bắt đầu lại ngay ở ngã tư đèn đỏ hoặc lúc vừa ngồi xuống bàn làm việc. Tâm bình an không nằm ở sự hoàn hảo cứng nhắc mà ở khả năng quay về nhẹ nhàng bất cứ lúc nào.',
        ],
      },
    ],
    dailyChecklist: [
      'Không xem mạng xã hội trong 15 phút đầu sau khi thức dậy; ngồi thẳng lưng thở sâu 5 hơi chánh niệm.',
      'Đọc thầm lời phát nguyện Từ Bi và tri ân cha mẹ, Tam Bảo trước khi bước ra khỏi phòng.',
      'Mỉm cười dịu dàng với người đầu tiên bạn gặp hôm nay — dù là người thân hay bảo vệ, đồng nghiệp.',
    ],
  },
  {
    slug: 'hoa-giai-lo-au-bang-hoi-tho',
    id: 'hoa-giai-lo-au-bang-hoi-tho',
    title: 'Phương pháp Quán Niệm Hơi Thở (Anapanasati) để dứt trừ căng thẳng, bất an',
    excerpt:
      'Trong Kinh Nhập Tức Xuất Tức Niệm, Đức Phật chỉ dạy hơi thở chính là sợi dây neo giữ tâm thức trước mọi sóng gió...',
    image: getArticleImage('hoa-giai-lo-au-bang-hoi-tho'),
    authorOrSource: 'Thiền Học Nguyên Thủy (Trung Bộ Kinh)',
    category: 'Chữa lành tâm',
    readTime: '7 phút đọc',
    quote: {
      text: 'Thở vào một hơi dài, vị ấy tuệ tri: Tôi thở vào một hơi dài. Thở ra một hơi dài, vị ấy tuệ tri: Tôi thở ra một hơi dài... Như vậy vị ấy an tịnh thân hành.',
      source: 'Kinh Nhập Tức Xuất Tức Niệm (Anapanasati Sutta — MN 118)',
    },
    sections: [
      {
        heading: '1. Bản chất của lo âu dưới góc nhìn Duy Thức và Tứ Niệm Xứ',
        paragraphs: [
          'Nếu quan sát kỹ cấu trúc của một cơn căng thẳng hay lo âu, ta sẽ nhận ra một quy luật lặp đi lặp lại: thân xác ta đang ngồi ngay tại căn phòng yên tĩnh lúc này, nhưng tâm trí lại du hành về những lỗi lầm đã trôi qua trong quá khứ, hoặc dựng lên hàng loạt kịch bản bất trắc chưa từng xảy ra ở tương lai.',
          'Sự chia rẽ giữa thân ở hiện tại và tâm lang thang trong ảo ảnh quá khứ - tương lai tạo ra sự kiệt quệ năng lượng rất lớn. Đức Phật dạy trong Kinh Nhất Dạ Hiền Giả: "Quá khứ không truy tìm, tương lai không ước vọng; quá khứ đã đoạn tận, tương lai lại chưa đến." Thứ duy nhất có khả năng kéo tâm thức trở về hợp nhất với thân ngay lập tức chính là hơi thở đang vào ra nơi cánh mũi.',
        ],
      },
      {
        heading: '2. Bốn bước thực hành Quán Niệm Hơi Thở 4-4-6-2',
        paragraphs: [
          'Bước một — Nhận diện đơn thuần: Không cần cố ép hơi thở phải thật sâu hay hoàn hảo ngay lập tức. Hãy để tự nhiên trong 3 nhịp đầu và chỉ ghi nhận: "À, lúc này tim mình đang đập nhanh, hơi thở đang hơi ngắn và nông." Việc gọi tên sự thật không phán xét giúp giảm ngay một nửa áp lực tâm lý.',
          'Bước hai — Thư giãn theo nhịp thở ra dài hơn thở vào: Khi lo âu, hệ thần kinh giao cảm kích hoạt mạnh. Khi ta chủ động thở vào nhẹ nhàng trong 4 giây, giữ nhẹ trong 4 giây và thở ra chậm rãi trong 6 giây rồi ngưng nghỉ 2 giây, dây thần kinh phế vị sẽ tự động phát tín hiệu làm chậm nhịp tim và hạ nồng độ hormone căng thẳng.',
          'Bước ba — An tịnh thân hành: Cùng với mỗi luồng hơi thở ra, thầm thả lỏng từng vùng hay gồng cứng trên cơ thể như vầng trán, hai quai hàm, đôi vai và bụng dưới. Hãy tưởng tượng mọi bồn chồn đang hòa tan ra theo làn khí ấm.',
          'Bước bốn — Quán chiếu tính Sinh Diệt: Quan sát cơn lo âu như một đám mây đen trôi ngang bầu trời quang đãng. Bầu trời tâm thức vốn rộng mở, còn mây đen dù dày đặc đến đâu cũng chỉ tụ rồi tan, không có thực thể cố định.',
        ],
      },
      {
        heading: '3. Ứng dụng Anapanasati giữa những thời khắc khủng hoảng',
        paragraphs: [
          'Điểm nhiệm mầu nhất của Anapanasati là bạn không cần thảm thiền, không cần hương trầm hay không gian vắng vẻ mới thực tập được. Ngay trước một cuộc họp căng thẳng, khi nhận một tin không vui, hay lúc trằn trọc mất ngủ lúc nửa đêm, chỉ cần đặt tay lên vùng bụng dưới cảm nhận sự phồng xẹp của hơi thở trong đúng 10 nhịp, bạn đã dừng lại phản ứng bản năng và mở ra không gian của trí tuệ sáng suốt.',
        ],
      },
    ],
    dailyChecklist: [
      'Thiết lập 2 phút thực hành nhịp thở 4-4-6-2 trên Phòng Thiền Hơi Thở vào giữa trưa và trước giờ ngủ.',
      'Mỗi khi gặp cơn bực bội, chưa vội nói lời gì trong 3 chu kỳ hít sâu - thở chậm.',
      'Trước khi đi ngủ, buông lỏng đôi vai và theo dõi 10 hơi thở phồng - xẹp để an giấc tự nhiên.',
    ],
  },
  {
    slug: 'luat-nhan-qua-trong-loi-noi',
    id: 'luat-nhan-qua-trong-loi-noi',
    title: 'Chánh Ngữ trong nhà Phật: Lời nói ái ngữ kết thiện duyên trăm năm',
    excerpt:
      'Khẩu nghiệp là cánh cửa dễ tạo phước nhưng cũng dễ gây họa nhất. Tu tập Chánh Ngữ chính là chìa khóa chuyển hóa vận mệnh...',
    image: getArticleImage('luat-nhan-qua-trong-loi-noi'),
    authorOrSource: 'Phật Học Ứng Dụng',
    category: 'Nhân quả & Phúc báo',
    readTime: '6 phút đọc',
    quote: {
      text: 'Lời nói hay đẹp ví như hoa sen tỏa hương giữa đời; còn lời nói cay nghiệt ví như cây búa tự chặt đứt gốc rễ thiện căn của chính mình.',
      source: 'Tạp A-Hàm & Kinh Pháp Cú',
    },
    sections: [
      {
        heading: '1. Sức nặng vô hình của Khẩu Nghiệp trong đời sống hiện đại',
        paragraphs: [
          'Cổ nhân có câu: "Bệnh tòng khẩu nhập, họa tòng khẩu xuất." Trong Thập Thiện Nghiệp Đạo, thân nghiệp có ba (không sát sinh, không trộm cắp, không tà hạnh), ý nghiệp có ba (không tham, không sân, không si), còn riêng khẩu nghiệp chiếm tới bốn điều: không nói dối, không nói lưỡi đôi chiều, không nói lời thô ác và không nói lời thêu dệt vô ích.',
          'Ngày nay, phạm vi khẩu nghiệp không chỉ dừng lại ở lời nói trực tiếp mà mở rộng sang từng dòng bình luận trên mạng xã hội, từng tin nhắn vội vàng gửi đi trong lúc nóng giận. Một vết thương trên da thịt vài tuần sẽ lành, nhưng một câu nói xúc phạm hay gieo tiếng oan có thể hằn sâu trong ký ức một con người suốt hàng chục năm, kéo theo những oán kết nhân quả dây dưa nhiều kiếp.',
        ],
      },
      {
        heading: '2. Bốn ranh giới vàng của Chánh Ngữ theo Bát Chánh Đạo',
        paragraphs: [
          'Thứ nhất, Chân thật ngữ — Nói đúng sự thật và biết bảo vệ sự tin cậy. Người giữ giới không nói dối không có nghĩa là nói tuột ra mọi điều gây tổn thương dưới danh nghĩa "thẳng tính", mà là không xuyên tạc, không bóp méo sự thật vì tư lợi hay hư danh.',
          'Thứ hai, Hòa hợp ngữ — Tuyệt đối tránh lời đâm thọc, kể xấu sau lưng khiến người thân rạn nứt hay tập thể chia rẽ. Khi nghe chuyện thị phi về người vắng mặt, người giữ Chánh Ngữ chọn im lặng lắng nghe không hùa theo, hoặc khéo léo nhắc đến điểm tốt của người ấy.',
          'Thứ ba, Ái ngữ và Nhu hòa ngữ — Dùng giọng nói êm ái, tôn trọng phẩm giá người đối diện ngay cả khi cần góp ý thẳng thắn. Ái ngữ không phải lời nịnh bợ khéo léo giả tạo, mà phát xuất từ lòng thương không muốn ai phải đau lòng.',
          'Thứ tư, Thực nghĩa ngữ — Nói đúng lúc, đúng chỗ, mang lại giá trị xây dựng, an ủi hoặc khai sáng. Biết giữ sự im lặng thánh thiện khi không cần thiết giúp tâm giữ lại được rất nhiều định lực.',
        ],
      },
      {
        heading: '3. Ba câu hỏi sàng lọc trước khi mở lời hay bấm nút gửi',
        paragraphs: [
          'Trước khi phát ngôn một điều quan trọng hoặc phê bình ai đó, người thực tập hãy tự hỏi ba điều đơn giản mà Đức Phật thường nhắc hàng đệ tử: Điều này có đúng sự thật không? Điều này có đem lại lợi ích cho người nghe không? Và đây đã phải lúc thích hợp để nói với tâm từ bi hay chưa?',
          'Nếu câu trả lời là "không" ở bất kỳ khâu nào, hãy giữ nụ cười hiền hòa và cho câu nói ấy được lắng xuống. Chẳng bao lâu, bạn sẽ nhận ra xung quanh mình bỗng tràn ngập những người bạn chân thành, tin cậy và gia đạo trở nên êm ấm kỳ lạ.',
        ],
      },
    ],
    dailyChecklist: [
      'Thực tập "Tam Tư Nhi Hậu Ngôn": kiểm tra Tính Chân Thật — Tính Lợi Ích — Thái Độ Từ Hòa trước khi góp ý.',
      'Dành ít nhất một lời khen chân thành, biết ơn đến cha mẹ, bạn đời hoặc đồng nghiệp trong ngày.',
      'Tuyệt đối không tham gia bàn tán chuyện thị phi hoặc viết bình luận chỉ trích trên mạng xã hội hôm nay.',
    ],
  },
  {
    slug: 'dao-hieu-va-bao-an',
    id: 'dao-hieu-va-bao-an',
    title: 'Chữ Hiếu trong đạo Phật: Cách báo hiếu cha mẹ hiện tiền và cửu huyền thất tổ',
    excerpt:
      'Đức Phật dạy: Tâm hiếu là tâm Phật, hạnh hiếu là hạnh Phật. Báo hiếu chân chính không nằm ở mâm cao cỗ đầy...',
    image: getArticleImage('dao-hieu-va-bao-an'),
    authorOrSource: 'Kinh Vu Lan & Báo Hiếu Phụ Mẫu',
    category: 'Hiếu đạo',
    readTime: '7 phút đọc',
    quote: {
      text: 'Nếu không gặp thời có Phật ra đời, khéo thờ phụng cha mẹ tức là thờ phụng Đức Phật.',
      source: 'Kinh Đại Tập & Kinh Tâm Địa Quán',
    },
    sections: [
      {
        heading: '1. Hiểu đúng tâm hiếu vượt ngoài hình thức lễ nghi',
        paragraphs: [
          'Phật giáo không tách rời đời sống thế gian mà đặt nền tảng đạo đức trên lòng biết ơn sâu sắc — đứng đầu là Tứ Trọng Ân, trong đó ân cha mẹ sinh thành dưỡng dục được tôn vinh như hai vị Phật sống trong gia đình. Trong Kinh Tăng Chi Bộ, Đức Thế Tôn khẳng định: dù người con có cõng cha trên vai trái, cõng mẹ trên vai phải đi vòng quanh núi Tu Di hàng trăm năm, cũng chưa thể đền đáp trọn vẹn công ơn bồng bế, nhường cơm sẻ áo của hai đấng sinh thành.',
          'Thế nhưng, báo hiếu trong đạo Phật không dừng lại ở việc cung phụng tiền bạc hay tổ chức tiệc tùng linh đình, mà đòi hỏi sự thấu cảm tinh tế đối với cả đời sống vật chất lẫn bình an tâm linh của cha mẹ.',
        ],
      },
      {
        heading: '2. Phụng dưỡng cha mẹ hiện tiền: Vật chất đi cùng Chánh Pháp',
        paragraphs: [
          'Điều dễ thấy nhất của người con trưởng thành là bận rộn mưu sinh đến mức ít dành thời gian lắng nghe cha mẹ. Cha mẹ tuổi xế chiều thường không thiếu một bữa cơm ngon bằng việc thiếu sự kiên nhẫn trò chuyện của con cái. Khi về thăm nhà hay gọi điện hỏi thăm, sự có mặt trọn vẹn — không vừa nói chuyện vừa cúi đầu xem điện thoại — chính là món quà hiếu hạnh ấm áp nhất.',
          'Đặc biệt, Đức Phật dạy phương pháp báo hiếu tối thượng đối với cha mẹ còn tại thế: nếu cha mẹ chưa biết tin Nhân Quả, hãy khéo léo khuyến khích cha mẹ làm việc thiện; nếu cha mẹ còn xan tham, hãy cùng cha mẹ mở lòng bố thí; nếu tâm cha mẹ hay sầu lo, hãy dịu dàng dẫn dắt cha mẹ đến với câu niệm Phật, giữ gìn tâm an lành nơi Tam Bảo.',
        ],
      },
      {
        heading: '3. Hiếu đạo với cửu huyền thất tổ đã quá vãng',
        paragraphs: [
          'Nhiều gia đình vì muốn làm tròn chữ hiếu trong ngày giỗ chạp lại sát sinh quá nhiều gà vịt, hải sản để bày mâm cao cỗ đầy. Theo Kinh Địa Tạng Bồ Tát Bổn Nguyện, việc sát hại sinh linh để cúng tế vô tình tăng thêm nghiệp chướng cho cả người sống lẫn hương linh người quá cố.',
          'Cách tri ân cửu huyền thất tổ thiết thực và thanh tịnh nhất là gìn giữ gia phong hòa thuận, chuẩn bị mâm cơm chay tịnh thành kính, tụng một thời Kinh A Di Đà hoặc Kinh Địa Tạng, thắp nén tâm hương và đem công đức làm từ thiện, phóng sinh hồi hướng trọn vẹn cho ông bà tổ tiên được nương ánh sáng Phật Đà sớm sanh về cõi lành.',
        ],
      },
    ],
    dailyChecklist: [
      'Gọi điện hoặc ngồi trò chuyện lắng nghe cha mẹ ít nhất 10 phút với tâm dịu dàng, không vội vàng.',
      'Kiểm tra và ghi nhớ ngày giỗ Âm lịch của ông bà trong mục Sổ Giỗ Chạp để chủ động chuẩn bị lễ chay.',
      'Sau mỗi thời công phu sáng/tối, dành 30 giây hồi hướng công đức bình an cho cha mẹ và gia tiên.',
    ],
  },
  {
    slug: 'buong-xa-chap-nga',
    id: 'buong-xa-chap-nga',
    title: 'Cội nguồn của khổ đau đến từ đâu và con đường buông xả',
    excerpt:
      'Phiền não không tự sinh ra từ ngoại cảnh, mà khởi lên từ tâm chấp trước vào những điều vốn dĩ vô thường...',
    image: getArticleImage('buong-xa-chap-nga'),
    authorOrSource: 'Thiền Quán Trung Đạo',
    category: 'Chữa lành tâm',
    readTime: '6 phút đọc',
    quote: {
      text: 'Đừng nắm giữ bất kỳ điều gì một cách cố chấp; buông bỏ đến đâu, lòng nhẹ nhõm và tự tại đến đó.',
      source: 'Thiền sư Ajahn Chah',
    },
    sections: [
      {
        heading: '1. Căn bệnh bám chấp vào "cái tôi" và "của tôi"',
        paragraphs: [
          'Vì sao cùng một sự việc xảy ra — chẳng hạn một cơn mưa bất chợt hay một kế hoạch thay đổi vào phút chót — người này vẫn giữ được nụ cười điềm nhiên trong khi người kia lại bực bội suốt cả ngày? Câu trả lời không nằm ở thời tiết hay hoàn cảnh, mà nằm ở độ dày của tâm chấp thủ nơi mỗi người.',
          'Bản năng phàm phu thường đóng khung mọi thứ quanh ba chữ: "Tôi" và "Của tôi". Tôi muốn người khác phải hiểu tôi ngay lập tức, công sức của tôi phải được khen thưởng đúng ý tôi, người thân của tôi không bao giờ được đổi thay. Khi thực tế vận hành theo định luật Duyên Khởi và Vô Thường — luôn biến chuyển do trăm ngàn điều kiện — cái tôi bị va chạm lập tức phản ứng thành giận dữ, tủi thân và khổ đau.',
        ],
      },
      {
        heading: '2. Phân biệt giữa "Buông xả" và "Buông xuôi"',
        paragraphs: [
          'Nhiều người lầm tưởng buông xả là từ bỏ trách nhiệm, sống hờ hững, ai làm gì mặc kệ hoặc không còn nỗ lực vươn lên. Trái lại hoàn toàn! Trong tinh thần Đại Thừa và Nguyên Thủy, buông xả là thái độ trí tuệ cao độ: dốc hết tâm huyết, thiện chí làm tròn nhân tốt ở hiện tại, nhưng không trói buộc hạnh phúc của mình vào kết quả phải đúng y khuôn mẫu.',
          'Ví như người nông dân gieo hạt giống tốt, chăm bón tưới tẩm đầy đủ mỗi ngày nhưng hiểu rằng mùa màng còn phụ thuộc nắng mưa của đất trời. Khi ta buông xuống tâm lý cầu toàn cực đoan và thôi thù hận những lỗi lầm đã qua của người khác, người đầu tiên được giải thoát khỏi ngục tù chính là bản thân mình.',
        ],
      },
      {
        heading: '3. Thực tập bàn tay mở trong từng tình huống nhỏ',
        paragraphs: [
          'Hãy hình dung khi nắm chặt nắm tay lại suốt nhiều giờ, bàn tay sẽ mỏi nhừ và chẳng thể đón nhận thêm bất cứ món quà nào mới. Ngược lại, khi từ tốn mở lòng bàn tay ra, sự nhẹ nhõm tràn về tức khắc.',
          'Mỗi khi nhận ra tâm đang siết chặt vào một lời nói khó nghe hay một kỳ vọng chưa thành, hãy thử nhẩm thầm: "Chuyện này rồi cũng qua", "Ai cũng có những giới hạn và nỗi khổ riêng." Chính sự thấu cảm ấy biến nút thắt phiền não thành mảnh đất màu mỡ của lòng bao dung.',
        ],
      },
    ],
    dailyChecklist: [
      'Nhận diện một điều khiến bạn bận tâm nhất hôm nay và phân tách: phần nào mình kiểm soát được, phần nào thuộc về ngoại duyên cần buông.',
      'Tha thứ cho một thiếu sót nhỏ của bản thân hoặc người khác thay vì dằn vặt kéo dài.',
      'Thực tập dọn bớt 3 món đồ không còn dùng đến trong nhà để cảm nhận sự nhẹ nhàng của tinh thần tối giản.',
    ],
  },
  {
    slug: 'y-nghia-an-chay-trai-gioi',
    id: 'y-nghia-an-chay-trai-gioi',
    title: 'Ý nghĩa thực sự của việc ăn chay và giữ giới trong những ngày Trai',
    excerpt:
      'Ăn chay không chỉ nuôi dưỡng thân thể thanh nhẹ mà còn là pháp thực hành lòng đại bi đối với muôn loài chúng sinh...',
    image: getArticleImage('y-nghia-an-chay-trai-gioi'),
    authorOrSource: 'Cẩm Nang Cư Sĩ — Kinh Phạm Võng',
    category: 'Nhân quả & Phúc báo',
    readTime: '6 phút đọc',
    quote: {
      text: 'Phật tử muốn thành tựu hạnh Từ Bi, không nên ăn thịt chúng sinh; bởi hết thảy chúng sinh đều có Phật tính và từng là thân quyến trong nhiều đời.',
      source: 'Kinh Phạm Võng & Kinh Lăng Già',
    },
    sections: [
      {
        heading: '1. Trai giới: Hơn cả chuyện thay đổi thực đơn',
        paragraphs: [
          'Trong văn hóa Phật giáo Việt Nam, truyền thống ăn chay kỳ (Lục Trai vào các ngày 8, 14, 15, 23, 29, 30 Âm lịch hoặc Thập Trai) đã trở thành nét đẹp tâm linh sâu sắc qua hàng ngàn năm. Thế nhưng chữ "Trai" trong đạo Phật nguyên nghĩa không chỉ là ăn thực vật ("chay"), mà nghĩa là "Thanh Tịnh" — giữ cho cả thân, khẩu và ý đều trong sạch trong những ngày đặc biệt đó.',
          'Thật đáng suy ngẫm nếu một người cả ngày ăn toàn đậu hũ, rau củ nhưng miệng vẫn lớn tiếng la mắng người nhà, tâm vẫn đầy oán trách hơn thua. Ngược lại, ăn chay đúng nghĩa là dịp ta tạm dừng thói quen hưởng thụ khẩu vị quen thuộc để nuôi dưỡng lòng trắc ẩn và sự điềm tĩnh nội tâm.',
        ],
      },
      {
        heading: '2. Ba lợi ích thiết thực về Tâm linh, Sức khỏe và Phước báu',
        paragraphs: [
          'Về mặt Tâm linh: Theo Kinh Địa Tạng, vào các ngày Lục Trai và Thập Trai, chư Thiên thiện thần tuần hành quan sát nhân gian. Việc tạm ngưng sát sinh, hướng tâm quy kính Tam Bảo giúp cắt đứt duyên oán trái với muôn loài, nuôi dưỡng hạt giống Đại Bi bình đẳng.',
          'Về mặt Thể chất: Một hoặc vài ngày thanh lọc mỗi tháng với các loại ngũ cốc nguyên hạt, rau xanh, đậu hạt và thảo mộc giúp hệ tiêu hóa được nghỉ ngơi, giảm gánh nặng chuyển hóa, nhờ vậy đầu óc nhẹ nhàng, sáng suốt và rất dễ an trú khi ngồi thiền hay tụng kinh.',
          'Về mặt Nhân Quả và Môi Sinh: Giảm tiêu thụ thịt động vật góp phần bảo vệ nguồn nước, giảm phát thải và nuôi dưỡng tâm tri túc — biết hài lòng với những món ăn giản dị từ đất mẹ.',
        ],
      },
      {
        heading: '3. Bí quyết ăn chay dưỡng sinh đủ chất và hoan hỷ',
        paragraphs: [
          'Người mới bắt đầu không cần gò ép cực đoan dễ sinh mệt mỏi mà có thể khởi đầu từ 2 ngày Sóc - Vọng (Mùng 1 và Rằm), rồi tiến dần lên Lục Trai (6 ngày/tháng) hoặc Thập Trai (10 ngày/tháng). Chú ý kết hợp đa dạng đạm thực vật (đậu hũ, nấm, các loại đậu hạt), chất béo lành mạnh (mè đen, óc chó, dầu thực vật ép lạnh) và hạn chế thực phẩm giả mặn chiên rán nhiều dầu mỡ công nghiệp.',
        ],
      },
    ],
    dailyChecklist: [
      'Mở Lịch Vạn Niên & Trai Giới để bật nhắc nhở các ngày Lục Trai / Thập Trai trong tháng.',
      'Thử chế biến một bữa cơm chay thanh đạm 3 món với lòng biết ơn công sức người nông dân.',
      'Giữ trọn khẩu nghiệp hiền hòa suốt ngày Trai giới: không nổi nóng, không chỉ trích ai.',
    ],
  },
  {
    slug: 'thien-trong-cong-viec',
    id: 'thien-trong-cong-viec',
    title: 'Nghệ thuật giữ tâm bất động giữa muôn vàn biến động nơi công sở',
    excerpt:
      'Làm sao để vừa hoàn thành xuất sắc công việc vừa giữ được sự tĩnh lặng như mặt nước hồ thu?...',
    image: getArticleImage('thien-trong-cong-viec'),
    authorOrSource: 'Thiền Đời Thường',
    category: 'Thiền đời thường',
    readTime: '6 phút đọc',
    quote: {
      text: 'Đói đến thì ăn, mệt đến thì ngủ; làm việc nào biết rõ mình đang làm việc ấy, ấy là công phu tối thượng.',
      source: 'Ngữ Lục Thiền Tông — Tổ Bách Trượng',
    },
    sections: [
      {
        heading: '1. Cạm bẫy "đa nhiệm" và sự xao nhãng triền miên',
        paragraphs: [
          'Rất nhiều người cư sĩ than phiền: "Tôi quá bận rộn với công việc công sở, họp hành, chăm lo gia đình nên chẳng có thời gian đi chùa hay hành thiền." Hiểu như vậy vô tình thu hẹp Đạo Phật lại chỉ còn ở trong chánh điện bốn bức tường. Đức Phật Hoàng Trần Nhân Tông từng dạy trong bài phú Cư Trần Lạc Đạo: "Ở đời vui đạo hãy tùy duyên" — chính môi trường làm việc đầy áp lực lại là trường học rèn luyện định lực tốt nhất.',
          'Nguyên nhân chính gây kiệt sức nơi công sở không hẳn là khối lượng công việc lớn, mà là tâm thức luôn bị phân tán (multitasking): tay đang gõ báo cáo nhưng đầu lại lo lắng cuộc họp chiều mai, tai nghe tin nhắn nhóm, mắt liếc email chưa trả lời. Tâm phân mảnh khiến hiệu suất giảm sút mà tinh thần luôn hụt hơi.',
        ],
      },
      {
        heading: '2. Bốn phép "Vi Thiền" giữa tám giờ vàng ngọc',
        paragraphs: [
          'Một là Pháp Độc Nhất Tâm (Single-tasking): Trong một khung giờ làm việc 45 phút, đóng các tab không liên quan, chỉ chuyên chú giải quyết trọn vẹn một đầu việc duy nhất. Làm hết mình nhưng không cuống quýt.',
          'Hai là Tiếng chuông chánh niệm nơi văn phòng: Mỗi khi điện thoại reo, thang máy mở cửa hay chuông tin nhắn vang lên, thay vì giật mình bực bội, hãy biến âm thanh ấy thành tiếng chuông chùa nhắc ta hít vào một hơi nhẹ, thả lỏng cổ vai rồi mới đáp lời.',
          'Ba là Khoảng lặng 60 giây chuyển việc: Giữa lúc rời cuộc họp căng thẳng và lúc bắt tay vào nhiệm vụ mới, nhắm mắt nghỉ 1 phút để tâm không mang theo dư chấn cảm xúc sang đầu việc sau.',
          'Bốn là Làm việc bằng tâm Phụng Sự thay vì cạnh tranh hơn thua: Khi ta nhìn sản phẩm hay dịch vụ mình tạo ra đang giúp đồng nghiệp bớt vất vả, giúp khách hàng hài lòng hơn, công việc lập tức có ý nghĩa thiêng liêng.',
        ],
      },
      {
        heading: '3. Giữ tâm thản nhiên trước khen chê nơi tập thể',
        paragraphs: [
          'Trong kinh Bát Đại Nhân Giác, Đức Phật chỉ rõ danh lợi và khen chê là tám ngọn gió lớn thường thổi bạt người chưa có định lực. Khi dự án thành công được tán dương, nhớ thầm biết ơn công sức tập thể để không sanh ngã mạn; khi gặp phê bình hay kết quả chưa trọn vẹn, giữ đầu óc bình tĩnh tiếp nhận thông tin hữu ích để sửa chữa chứ không rơi vào tự ti hay oán trách.',
        ],
      },
    ],
    dailyChecklist: [
      'Áp dụng 1 chu kỳ làm việc đơn nhiệm 45 phút không kiểm tra tin nhắn phi công việc.',
      'Lấy mỗi lần đứng dậy lấy nước uống làm thời gian "thiền hành 20 bước" cảm nhận bàn chân chạm đất.',
      'Trước khi tắt máy ra về, thầm hồi hướng công sức lao động hôm nay đã góp phần phụng sự đời sống.',
    ],
  },
  {
    slug: 'cong-duc-tung-kinh-duoc-su',
    id: 'cong-duc-tung-kinh-duoc-su',
    title: 'Mười hai đại nguyện của Đức Phật Dược Sư và pháp tu tiêu tai diên thọ',
    excerpt:
      'Ánh sáng lưu ly của Đức Phật Dược Sư chính là biểu tượng cho sự trong sáng tuyệt đối của tâm thức không vướng bụi trần...',
    image: getArticleImage('cong-duc-tung-kinh-duoc-su'),
    authorOrSource: 'Tam Tạng Đại Thừa',
    category: 'Hiếu đạo',
    readTime: '7 phút đọc',
    quote: {
      text: 'Thân như lưu ly trong ngoài sáng suốt, không chút tỳ vết; ánh sáng trí tuệ chiếu khắp muôn phương phá tan đêm tối vô minh.',
      source: 'Kinh Dược Sư Lưu Ly Quang Như Lai Bổn Nguyện Công Đức',
    },
    sections: [
      {
        heading: '1. Ý nghĩa thâm sâu của danh hiệu Dược Sư Lưu Ly Quang',
        paragraphs: [
          'Trong truyền thống Đại Thừa, Đức Phật Thích Ca Mâu Ni được tôn xưng là vị Đại Y Vương chữa lành bệnh khổ cho muôn loài, và ở phương Đông có thế giới Tịnh Lưu Ly thanh tịnh trang nghiêm của Đức Dược Sư Lưu Ly Quang Như Lai. Ngài tượng trưng cho khả năng chữa trị cả hai tầng bệnh tật: thân bệnh (đau yếu thể xác, tai nạn, thiếu thốn thuốc men) và tâm bệnh (ba độc tham, sân, si âm thầm gặm nhấm bình an).',
          'Hình ảnh viên ngọc Lưu Ly xanh biếc trong suốt cả trong lẫn ngoài không chỉ mang vẻ đẹp trang nghiêm mà còn dạy người tu bài học về sự chân thật, minh bạch: sống sao cho lời nói, hành động và ý nghĩ bên trong đồng nhất, không che giấu điều gian dối.',
        ],
      },
      {
        heading: '2. Tinh hoa Mười Hai Đại Nguyện cứu khổ độ sinh',
        paragraphs: [
          'Khi còn hành Bồ Tát đạo, Đức Dược Sư đã phát 12 Đại Nguyện rộng lớn thiết thực cho đời sống hiện tại của chúng sinh: từ nguyện cho chúng sinh có đủ áo mặc cơm ăn, thân hình đoan chánh không tật nguyền khốn khổ, được thoát khỏi cảnh tù đày oan trái, cho đến nguyện cứu người bệnh nặng không nơi nương tựa có thầy hay thuốc quý.',
          'Đặc biệt hơn cả là đại nguyện chuyển hóa người lầm đường lạc lối, tà kiến chấp trước quay về nẻo Chánh Pháp, và giúp người phụ nữ hay người yếu thế vượt qua nghịch cảnh vươn tới tự do tinh thần. Chính vì mang tính ứng dụng thực tế rất cao ngay trong hiện đời chứ không đợi sau khi mất, Kinh Dược Sư thường được trì tụng rộng rãi trong các lễ cầu an đầu năm hoặc khi gia đình có người bệnh duyên.',
        ],
      },
      {
        heading: '3. Hành trì pháp Dược Sư đúng chánh tín, không mê tín',
        paragraphs: [
          'Cầu an theo tinh thần Kinh Dược Sư không phải là sự van xin đổi chác hay đốt vàng mã cầu may, mà là thực hành ba thiện pháp song song: Thứ nhất, nhất tâm trì tụng danh hiệu "Nam Mô Tiêu Tai Diên Thọ Dược Sư Phật" hoặc đọc tụng một phẩm Kinh Dược Sư giúp tâm nhiếp định, tăng cường sức đề kháng tinh thần cho người bệnh.',
          'Thứ hai, hành hạnh bố thí thuốc men, giúp đỡ người nghèo ốm đau, thăm hỏi người neo đơn bệnh viện để gieo trực tiếp nhân lành sức khỏe và trường thọ. Thứ ba, giữ gìn thân tâm sạch sẽ, ăn uống điều độ, phóng sinh bảo vệ sự sống — ấy chính là ngọn đèn Dược Sư 49 ngọn thắp sáng ngay giữa nhân gian.',
        ],
      },
    ],
    dailyChecklist: [
      'Đọc tụng một thời Kinh Dược Sư (có sẵn trong mục Kinh Tạng) hoặc trì 108 biến danh hiệu Đức Dược Sư.',
      'Chăm sóc giấc ngủ, bữa ăn thanh đạm và uống đủ nước để giữ gìn ngôi nhà thân thể khỏe mạnh.',
      'Gieo một duyên lành giúp đỡ người đau yếu hoặc đóng góp thiện nguyện y tế trong khả năng.',
    ],
  },
];

export function getArticleBySlug(slug: string): CuratedArticle | undefined {
  return CURATED_ARTICLES.find((a) => a.slug === slug || a.id === slug);
}

