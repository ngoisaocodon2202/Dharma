export interface GlossaryItem {
  id: string;
  term: string;
  sanskritPali?: string;
  category: 'can_ban' | 'tu_tap' | 'tam_hoc' | 'triet_hoc' | 'nghi_le';
  summary: string;
  detail: string;
  reflection: string;
}

export const GLOSSARY_CATEGORIES: Record<string, string> = {
  all: 'Tất cả',
  can_ban: 'Giáo lý căn bản',
  tu_tap: 'Pháp môn tu học',
  tam_hoc: 'Giới - Định - Tuệ',
  triet_hoc: 'Triết học',
  nghi_le: 'Nghi lễ & Đời sống',
};

export const BUDDHIST_GLOSSARY: GlossaryItem[] = [
  {
    id: 'vo-nga',
    term: 'Vô Ngã',
    sanskritPali: 'Anatta (Pali) / Anātman (Sanskrit)',
    category: 'can_ban',
    summary: 'Không có một thực thể bất biến, độc lập và vĩnh cửu gọi là "cái tôi" hay "bản ngã".',
    detail: 'Mọi sự vật và con người đều do năm uẩn (sắc, thọ, tưởng, hành, thức) duyên hợp mà thành. Vì do duyên hợp nên chúng luôn biến đổi, không thể tự tồn tại độc lập. Thấy được vô ngã giúp con người buông xả chấp thủ, giảm bớt tự ái và lòng ích kỷ.',
    reflection: 'Khi không còn quá bám chấp vào "của tôi" hay "là tôi", lòng ta nhẹ nhàng như mây trời thanh thản.',
  },
  {
    id: 'vo-thuong',
    term: 'Vô Thường',
    sanskritPali: 'Anicca (Pali) / Anitya (Sanskrit)',
    category: 'can_ban',
    summary: 'Đặc tính luôn luôn biến đổi, không bao giờ dừng lại của vạn vật trong vũ trụ.',
    detail: 'Không có gì tồn tại mãi ở trạng thái ban đầu. Thân thể ta có sinh, lão, bệnh, tử; tâm ý ta có sinh, trụ, dị, diệt; thế giới có thành, trụ, hoại, không. Hiểu vô thường không phải để bi quan, mà để trân trọng từng phút giây hiện tại và không hoảng hốt khi hoàn cảnh đổi thay.',
    reflection: 'Vì vạn vật vô thường, nên khổ đau cũng vô thường và sẽ qua đi. Hãy an trú trong hiện tại nhiệm màu.',
  },
  {
    id: 'duyen-khoi',
    term: 'Duyên Khởi (Nhân Duyên)',
    sanskritPali: 'Paṭiccasamuppāda (Pali)',
    category: 'triet_hoc',
    summary: 'Cái này có thì cái kia có; cái này sinh thì cái kia sinh; cái này diệt thì cái kia diệt.',
    detail: 'Không có sự vật nào tự nhiên sinh ra hay độc lập tồn tại. Mọi hiện tượng trong vũ trụ đều nương tựa vào nhau, tương tác lẫn nhau mà biểu hiện. Hiểu duyên khởi giúp ta mở rộng lòng yêu thương muôn loài, vì biết mình và người đều liên kết mật thiết.',
    reflection: 'Ta nhìn thấy mây trong cốc nước trà, nhìn thấy công sức của vạn người trong hạt cơm sớm.',
  },
  {
    id: 'bat-chanh-dao',
    term: 'Bát Chánh Đạo',
    sanskritPali: 'Ariya Aṭṭhaṅgika Magga (Pali)',
    category: 'tu_tap',
    summary: 'Tám con đường chân chánh đưa đến chấm dứt khổ đau và đạt an lạc Niết Bàn.',
    detail: 'Bao gồm: Chánh kiến (thấy đúng), Chánh tư duy (nghĩ đúng), Chánh ngữ (nói đúng), Chánh nghiệp (hành động đúng), Chánh mạng (nghề nghiệp chân chánh), Chánh tinh tấn (siêng năng việc thiện), Chánh niệm (nhớ nghĩ tỉnh giác), Chánh định (tập trung tâm ý).',
    reflection: 'Bát Chánh Đạo chính là kim chỉ nam cho lối sống đạo đức, trí tuệ và an lạc giữa đời thường.',
  },
  {
    id: 'tu-dieu-de',
    term: 'Tứ Diệu Đế',
    sanskritPali: 'Cattāri Ariyasaccāni (Pali)',
    category: 'can_ban',
    summary: 'Bốn chân lý mầu nhiệm cốt lõi mà Đức Phật giác ngộ dưới cội Bồ Đề.',
    detail: 'Gồm: Khổ đế (thực trạng sự bất toại nguyện), Tập đế (nguyên nhân của khổ do tham ái, si mê), Diệt đế (trạng thái chấm dứt khổ đau - Niết Bàn), Đạo đế (con đường chuyển hóa khổ đau - Bát Chánh Đạo).',
    reflection: 'Tứ Diệu Đế như toa thuốc đại lương y: chỉ rõ bệnh, tìm căn nguyên bệnh, khẳng định bệnh lành được, và trao phương thuốc chữa trị.',
  },
  {
    id: 'bat-nha',
    term: 'Bát Nhã',
    sanskritPali: 'Prajñā (Sanskrit) / Paññā (Pali)',
    category: 'triet_hoc',
    summary: 'Trí tuệ viên mãn thấu suốt thực tướng của vạn pháp là "Tính Không".',
    detail: 'Khác với kiến thức thế gian (dựa trên phân tích nhị nguyên), Bát Nhã là cái thấy trực giác thuần tịnh, vượt qua mọi sự chấp trước nhị biên, thấy vạn pháp không sinh không diệt, không dơ không sạch.',
    reflection: 'Trí tuệ Bát Nhã như ngọn đuốc sáng xua tan bóng đêm vô minh ngàn đời.',
  },
  {
    id: 'hoi-huong',
    term: 'Hồi Hướng',
    sanskritPali: 'Pariṇāmanā (Sanskrit)',
    category: 'nghi_le',
    summary: 'Đem công đức lành mình tạo chuyển giao và chia sẻ đến khắp tất cả chúng sanh.',
    detail: 'Sau khi làm việc thiện (tụng kinh, niệm Phật, bố thí, phóng sanh), người Phật tử không giữ công đức cho riêng mình mà nguyện hồi hướng cho cha mẹ, tổ tiên, và muôn loài cùng được an vui giải thoát.',
    reflection: 'Công đức như ngọn nến sáng, chia lửa cho hàng ngàn ngọn nến khác mà không bao giờ vơi cạn.',
  },
  {
    id: 'chanh-niem',
    term: 'Chánh Niệm',
    sanskritPali: 'Sati (Pali) / Smṛti (Sanskrit)',
    category: 'tu_tap',
    summary: 'Sự tỉnh giác, nhận biết trọn vẹn những gì đang xảy ra trong giây phút hiện tại.',
    detail: 'Khi đi biết mình đang đi, khi thở biết mình đang thở, khi uống trà biết mình đang uống trà. Không nuối tiếc quá khứ, không lo âu tương lai, chỉ có sự hiện diện trọn vẹn và an tịnh ở đây và bây giờ.',
    reflection: 'Chánh niệm là suối nguồn của bình an và trị liệu những thương tổn nơi tâm hồn.',
  },
  {
    id: 'tam-quy-ngu-gioi',
    term: 'Tam Quy & Ngũ Giới',
    sanskritPali: 'Ti-sarana & Pañca-sīla',
    category: 'nghi_le',
    summary: 'Nền tảng quy y Tam Bảo và năm điều đạo đức giữ gìn của người Phật tử tại gia.',
    detail: 'Tam Quy: Quay về nương tựa Phật, Pháp, Tăng. Ngũ Giới: Không sát sanh (bảo vệ sự sống), Không trộm cắp (tôn trọng tài sản), Không tà dâm (bảo vệ hạnh phúc gia đình), Không nói dối (nói lời chân thật hòa nhã), Không uống rượu/chất gây nghiện (giữ tâm trí sáng suốt).',
    reflection: 'Giữ giới không phải bị gò bó, mà là bức tường thành kiên cố bảo hộ ta khỏi hiểm nguy tai họa.',
  },
  {
    id: 'nghiep-bao',
    term: 'Nghiệp Báo (Nhân Quả)',
    sanskritPali: 'Kamma (Pali) / Karma (Sanskrit)',
    category: 'can_ban',
    summary: 'Quy luật hành động tạo tác từ Thân, Miệng, Ý đem lại quả báo tương ứng.',
    detail: 'Nghiệp lành sinh quả ngọt an vui, nghiệp dữ chuốc lấy quả cay khổ lụy. Không có vị thần linh nào thưởng phạt, chính ý niệm và hành vi của bản thân tự quyết định vận mệnh tương lai của chính mình.',
    reflection: 'Gieo hạt giống từ bi, ta gặt hái vườn hoa quả ngọt an lành cho muôn đời sau.',
  },
  {
    id: 'luc-do-ba-la-mat',
    term: 'Lục Độ Ba La Mật',
    sanskritPali: 'Ṣaṭ-pāramitā (Sanskrit)',
    category: 'tu_tap',
    summary: 'Sáu pháp tu rốt ráo đưa người hành giả từ bờ mê sang bến giác ngộ.',
    detail: 'Gồm: Bố thí (chia sẻ), Trì giới (giữ thanh tịnh), Nhẫn nhục (chịu đựng bao dung), Tinh tấn (chuyên cần siêng năng), Thiền định (tâm an định tĩnh), Trí tuệ (sáng suốt thấu suốt chân lý).',
    reflection: 'Sáu mái chèo đưa con thuyền Bồ Đề vượt qua biển khổ trần gian.',
  },
  {
    id: 'tu-vo-luong-tam',
    term: 'Tứ Vô Lượng Tâm',
    sanskritPali: 'Brahmavihāra (Bốn tâm vô lượng)',
    category: 'tam_hoc',
    summary: 'Bốn trạng thái tâm rộng lớn vô biên: Từ, Bi, Hỷ, Xả.',
    detail: 'Từ (Mettā - ban vui cho muôn loài), Bi (Karuṇā - cứu khổ cho chúng sanh), Hỷ (Muditā - vui với niềm vui của người khác), Xả (Upekkhā - buông bỏ không thiên vị oán hờn).',
    reflection: 'Nuôi dưỡng bốn tâm vô lượng là sống cuộc đời của một vị Bồ Tát giữa chốn nhân gian.',
  },
];

