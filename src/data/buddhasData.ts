export interface BuddhaItem {
  id: string;
  name: string;
  title: string;
  sanskrit: string;
  image: string;
  realm: string;
  symbol: string;
  tieuSu: {
    origin: string;
    story: string;
    meaning: string;
  };
  daiNguyen: {
    summary: string;
    vows: string[];
  };
  thanChu: {
    name: string;
    sanskrit: string;
    vietnamese: string;
    meaning: string;
    benefits: string;
  };
}

export const BUDDHAS_DATA: BuddhaItem[] = [
  // 1. ĐỨC PHẬT DƯỢC SƯ
  {
    id: 'duc-phat-duoc-su',
    name: 'Đức Phật Dược Sư',
    title: 'Dược Sư Lưu Ly Quang Vương Như Lai',
    sanskrit: 'Bhaiṣajyaguru Vaidūryaprabharāja',
    image: '/images/buddhas/duc-phat-duoc-su.png',
    realm: 'Tịnh Lưu Ly Quang Giới (Phương Đông)',
    symbol: 'Bình bát chứa linh dược cam lộ, nhành Kha-lê-lặc, sắc thân ngọc lưu ly',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Dược Sư Bổn Nguyện Công Đức (do ngài Huyền Trang dịch). Ngài là giáo chủ cõi Tịnh Lưu Ly cách Ta Bà mười muôn ức cõi Phật về phương Đông.',
      story: 'Khi còn tu hạnh Bồ Tát, Ngài đã thấu suốt nỗi khổ cùng cực của chúng sinh khi thân mang tật bệnh, tâm trí vướng chấp vô minh. Ngài phát tâm đại bi, thệ nguyện chữa lành cả thân bệnh lẫn tâm bệnh cho tất cả muôn loài.',
      meaning: 'Sắc thân màu xanh lưu ly trong suốt không tì vết biểu thị cho trí tuệ sáng suốt vô ngại, xua tan bóng tối u ám của nghiệp chướng và tham sân si.',
    },
    daiNguyen: {
      summary: '12 Đại nguyện diệt trừ tật bệnh, ban phát thuốc lành và ánh quang minh lưu ly:',
      vows: [
        'Nguyện thân phát ánh quang minh soi sáng vô lượng vô biên cõi nước.',
        'Nguyện thân như ngọc lưu ly trong ngoài sáng suốt, dứt trừ tà kiến.',
        'Nguyện ban cho chúng sinh vô số phương tiện thụ dụng, không để ai thiếu thốn.',
        'Nguyện dẫn dắt kẻ tu theo tà đạo trở về chánh đạo Nhất Thừa.',
        'Nguyện cho người tu hành giữ gìn giới hạnh thanh tịnh, nghe danh hiệu Ngài không đọa tam ác đạo.',
        'Nguyện chữa lành mọi khiếm khuyết sáu căn, đui điếc câm ngọng đều được vẹn toàn.',
        'Nguyện cho kẻ nghèo cùng không thầy không thuốc được an ổn, dứt trừ bệnh tật.',
        'Nguyện chuyển thân nữ thành nam trang nghiêm tướng hảo.',
        'Nguyện cứu độ muôn loài thoát khỏi lưới ma và cạm bẫy tà sư.',
        'Nguyện giải cứu người gặp hoạn nạn, giam cầm, hình ngục tra tấn.',
        'Nguyện cho kẻ đói khát được no đủ món ngon vi diệu trước khi thọ nhận pháp vị.',
        'Nguyện ban cho người nghèo khó áo ấm gấm vóc và đồ trang nghiêm thanh tịnh.',
      ],
    },
    thanChu: {
      name: 'Dược Sư Quán Đảnh Chân Ngôn',
      sanskrit: 'Namo Bhagavate Bhaisajyaguru Vaidurya Prabha Rajaya Tathagataya Arhate Samyaksambuddhaya. Tadyatha: Om Bhaisajye Bhaisajye Bhaisajya Samudgate Svaha.',
      vietnamese: 'Nam mô Bạc già phạt đế, Bệ sát xã, Lũ lô thích lưu ly, Bát lạt bà, Hắt ra xà dã, Đát tha yết đa dã, A ra ha đế, Tam miệu tam bột đà dã. Đát điệt tha: Án, Bệ sát thệ, Bệ sát thệ, Bệ sát xã, Tam một yết đế tỳ-ha-ha.',
      meaning: 'Kính lễ Đức Thế Tôn Dược Sư Lưu Ly Quang Vương Như Lai, Bậc Ứng Cúng, Chánh Biến Tri. Nguyện thần dược lưu ly vi diệu chữa lành mọi khổ đau, tật bệnh thân tâm.',
      benefits: 'Tiêu trừ bệnh chướng ngặt nghèo, giải trừ oan gia trái chủ, thân tâm an lạc, gia tăng tuổi thọ và phúc đức vô lượng.',
    },
  },

  // 2. ĐỨC PHẬT THÍCH CA MÂU NI
  {
    id: 'duc-phat-thich-ca',
    name: 'Đức Phật Thích Ca Mâu Ni',
    title: 'Bổn Sư Thích Ca Mâu Ni Phật',
    sanskrit: 'Śākyamuni Buddha (Siddhārtha Gautama)',
    image: '/images/buddhas/duc-phat-thich-ca.png',
    realm: 'Cõi Ta Bà (Saha World)',
    symbol: 'Bảo tòa Kim Cương, Ấn Xúc Địa (Bhumisparsha Mudra), Cội Bồ Đề giác ngộ',
    tieuSu: {
      origin: 'Đản sinh vào ngày Rằm tháng Tư năm 624 TCN tại vườn Lâm Tỳ Ni (Nepal). Ngài là Thái tử Tất Đạt Đa, con vua Tịnh Phạn và Hoàng hậu Ma Gia thành Ca Tỳ La Vệ.',
      story: 'Chứng kiến bốn cảnh Sinh - Lão - Bệnh - Tử nơi cổng thành, Ngài từ bỏ hoàng cung xuất gia tầm đạo. Trải qua 6 năm khổ hạnh rừng già và 49 ngày thiền quán dưới cội Bồ Đề, Ngài chứng đắc Vô Thượng Chánh Đẳng Chánh Giác, chuyển bánh xe Pháp luân khai sáng đạo Phật.',
      meaning: 'Danh hiệu Thích Ca biểu trưng cho đức Tính Năng Nhân (từ bi vô lượng); Mâu Ni biểu trưng cho Tịch Tĩnh (trí tuệ vắng lặng, đoạn sạch mọi vọng tưởng chấp thủ).',
    },
    daiNguyen: {
      summary: 'Tứ Hoằng Thệ Nguyện & Đại Bi Giáng Trần vì nhân loại khổ đau:',
      vows: [
        'Chúng sinh vô biên thề nguyện độ.',
        'Phiền não vô tận thề nguyện đoạn.',
        'Pháp môn vô lượng thề nguyện học.',
        'Phật đạo vô thượng thề nguyện thành.',
        'Nguyện giáng sinh vào đời ác năm trược (Ngũ Trược Ác Thế) để thắp sáng ngọn đèn chánh pháp, chỉ bày con đường Tứ Diệu Đế và Bát Chánh Đạo đưa chúng sinh thoát khỏi luân hồi.',
      ],
    },
    thanChu: {
      name: 'Thích Ca Mâu Ni Phật Tâm Chú',
      sanskrit: 'Om Muni Muni Mahamunaye Svaha.',
      vietnamese: 'Án Mâu Ni Mâu Ni Ma Ha Mâu Ni Dã Ta Bà Ha.',
      meaning: 'Hỡi Đấng Tịch Tĩnh, Bậc Tịch Tĩnh Vĩ Đại, nguyện hướng về tâm tịch tịnh sáng tỏ thanh tịnh vô thượng của Ngài.',
      benefits: 'Thanh lọc tạp niệm, nhiếp tâm an định, đánh thức hạt giống Bồ Đề và trí tuệ Bát Nhã sẵn có trong mỗi người.',
    },
  },

  // 3. ĐỨC PHẬT A DI ĐÀ
  {
    id: 'duc-phat-a-di-da',
    name: 'Đức Phật A Di Đà',
    title: 'Tiếp Dẫn Đạo Sư A Di Đà Phật',
    sanskrit: 'Amitābha (Vô Lượng Quang) / Amitāyus (Vô Lượng Thọ)',
    image: '/images/buddhas/duc-phat-a-di-da.png',
    realm: 'Cõi Tây Phương Cực Lạc (Sukhāvatī)',
    symbol: 'Hoa sen vàng tiếp dẫn, ấn Thiền Định / ấn Giáo Hóa, ánh quang minh chiếu khắp mười phương',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Vô Lượng Thọ, Kinh A Di Đà, Kinh Quán Vô Lượng Thọ. Ngài là giáo chủ cõi Tây Phương Cực Lạc cách Ta Bà mười muôn ức cõi Phật.',
      story: 'Tiền thân Ngài là Tỳ kheo Pháp Tạng dưới thời Đức Phật Thế Tự Tại Vương. Ngài đã quán sát 210 ức cõi Phật, chọn lọc những điều tối thắng nhất để phát 48 đại nguyện kiến tạo nên cõi Tịnh Độ trang nghiêm.',
      meaning: 'A Di Đà nghĩa là Vô Lượng Quang (ánh sáng trí tuệ soi thấu mười phương) và Vô Lượng Thọ (thọ mạng thường trụ vĩnh cửu cứu độ chúng sinh).',
    },
    daiNguyen: {
      summary: '48 Đại nguyện tiếp dẫn chúng sinh vãng sinh Tây Phương Cực Lạc:',
      vows: [
        'Nguyện cõi nước không có ba đường ác: địa ngục, ngạ quỷ, súc sinh.',
        'Nguyện mười phương chúng sinh chí tâm tin ưa, xưng niệm danh hiệu từ mười niệm cho đến trọn đời đều được vãng sinh (Bổn Nguyện thứ 18).',
        'Nguyện khi chúng sinh lâm chung, Ngài cùng Thánh chúng hiện thân tiếp dẫn.',
        'Nguyện tất cả người sinh về cõi Cực Lạc đều chứng đắc quả vị Bất Thối Chuyển, thân sắc vàng rực rỡ và đầy đủ ba mươi hai tướng tốt.',
        'Nguyện chúng sinh ở cõi Cực Lạc có thọ mạng vô lượng, trí tuệ và thần thông tự tại.',
      ],
    },
    thanChu: {
      name: 'Vãng Sinh Quyết Định Chân Ngôn',
      sanskrit: 'Namo Amitabhaya Tathagataya. Tadyatha: Amrtodbhave, Amrta Sambhave, Amrta Vikrante, Amrta Vikranta Gamini, Gagana Kirti Kare Svaha.',
      vietnamese: 'Nam mô a di đa bà dạ, Đa tha già đa dạ, Đa địa dạ tha: A di rị đô bà tỳ, A di rị đa tất đam bà tỳ, A di rị đa tì ca lan đế, A di rị đa tì ca lan đa, Già di nị, Già già na, Chỉ đa ca lệ, Ta bà ha.',
      meaning: 'Quy mạng Đức Phật A Di Đà Như Lai. Nguyện dòng nước cam lộ bất tử của Ngài tẩy sạch cội rễ phiền não, khiến cho tâm con thanh tịnh đồng với hư không.',
      benefits: 'Nhổ sạch gốc rễ phiền não và ác nghiệp từ vô lượng kiếp, hiện đời thân tâm an lạc, lâm chung được Đức Phật A Di Đà tiếp dẫn sinh về cõi Cực Lạc.',
    },
  },

  // 4. QUÁN THẾ ÂM NGHÌN MẮT NGHÌN TAY
  {
    id: 'quan-the-am-nghin-mat-nghin-tay',
    name: 'Quán Thế Âm Nghìn Mắt Nghìn Tay',
    title: 'Thiên Thủ Thiên Nhãn Quán Thế Âm Bồ Tát',
    sanskrit: 'Sahasrabhuja Avalokiteśvara',
    image: '/images/buddhas/quan-the-am-nghin-mat-nghin-tay.png',
    realm: 'Hiện thân biến hóa tối thắng tại cõi Ta Bà',
    symbol: 'Nghìn mắt trí tuệ, nghìn tay cầm 42 pháp khí mầu nhiệm, bình cam lộ, hoa sen xanh, chày kim cang',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Thiên Thủ Thiên Nhãn Quán Thế Âm Bồ Tát Quảng Đại Viên Mãn Vô Ngại Đại Bi Tâm Đà La Ni.',
      story: 'Khi nghe Đức Phật Thiên Quang Vương Tịnh Trụ truyền dạy Chú Đại Bi, Ngài đã khởi tâm đại từ bi vì muốn làm lợi ích an lạc cho tất cả chúng sinh mà phát thệ nguyện: "Nếu con có thể đem lại giải thoát cho muôn loài, xin khiến thân con liền sinh nghìn mắt nghìn tay". Lời vừa dứt, toàn thân liền mọc ra nghìn tay, mỗi lòng bàn tay có một con mắt trí tuệ soi rọi mười phương.',
      meaning: 'Nghìn mắt để thấy khắp nỗi thống khổ nhân gian, nghìn tay để giang ra che chở, tiếp cứu kịp thời không để sót bất kỳ một chúng sinh nào.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Viên Mãn Vô Ngại Đại Bi Tâm:',
      vows: [
        'Nguyện cho chúng sinh trì tụng chú Đại Bi nếu bị đọa tam ác đạo thề không thành Chánh Giác.',
        'Nguyện cho người trì tụng không được vãng sinh cõi Phật thề không thành Chánh Giác.',
        'Nguyện cho người thọ trì không đắc vô lượng tam muội biện tài thề không thành Chánh Giác.',
        'Nguyện tiêu trừ mười lăm thứ ác tử và thành tựu mười lăm thứ thiện sinh tốt lành.',
        'Nguyện hiện thân cứu giúp kẻ lâm cảnh hiểm nghèo nơi nước sôi lửa bỏng, trộm cướp đao binh.',
      ],
    },
    thanChu: {
      name: 'Đại Bi Tâm Đà La Ni (Chú Đại Bi)',
      sanskrit: 'Namo Ratna Trayaya, Namo Arya Valokiteshvaraya Bodhisattvaya Mahasattvaya Mahakarunikaya... Tadyatha: Om Avaloki Lokite Karate E Hrih Mahabodhisattva Svaha.',
      vietnamese: 'Nam mô Hắc Ra Đát Na Đa Ra Dạ Da, Nam mô A Rị Da, Bà Lô Kiết Đế Thước Bát Ra Da, Bồ Đề Tát Đỏa Bà Da, Ma Ha Tát Đỏa Bà Da, Ma Ha Ca Lô Ni Ca Da... Án, Tất Điện Đô, Mạn Đa Ra, Bạt Đà Dạ, Ta Bà Ha.',
      meaning: 'Bài chú gồm 84 câu xưng tán công đức của các hóa thân Bồ Tát Quán Âm, phát nguyện đại bi cứu độ muôn loài thoát khỏi biển khổ sinh tử luân hồi.',
      benefits: 'Diệt trừ mọi ác nghiệp sâu nặng, tiêu trừ ma chướng và bệnh hiểm nghèo, sở cầu như ý, gia đạo an khang, đời đời sinh ra nơi cõi Phật.',
    },
  },

  // 5. PHẬT DI LẶC
  {
    id: 'phat-di-lac',
    name: 'Phật Di Lặc',
    title: 'Đương Lai Hạ Sinh Di Lặc Tôn Phật',
    sanskrit: 'Maitreya Bodhisattva (Từ Thị)',
    image: '/images/buddhas/phat-di-lac.png',
    realm: 'Cung trời Đâu Suất (Tuṣita) & Cõi Ta Bà vị lai',
    symbol: 'Nụ cười hoan hỷ vô lượng, bụng to chứa trọn bao dung, túi vải càn khôn (Bố Đại)',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Di Lặc Hạ Sanh, Kinh Di Lặc Thượng Sanh. Ngài là vị Bồ Tát Nhất Sanh Bổ Xứ, hiện đang thuyết pháp tại cõi trời Đâu Suất.',
      story: 'Theo huyền ký của Phật Thích Ca, sau khi chánh pháp thời kỳ này chấm dứt, Bồ Tát Di Lặc sẽ giáng sinh xuống trần gian, thành đạo dưới cội cây Long Hoa và khai mở Tam Hội Long Hoa độ thoát vô lượng chúng sinh.',
      meaning: 'Danh hiệu Từ Thị nghĩa là gieo trồng lòng từ ái không hại mạng chúng sinh. Bụng to tượng trưng cho tâm lượng bao dung chứa cả điều thiên hạ khó chứa; miệng cười hoan hỷ xua tan mọi ưu phiền đố kỵ trần gian.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Từ Bi Hỷ Xả & Hòa Bình Nhân Loại:',
      vows: [
        'Nguyện tu hạnh Từ Tâm Tam Muội, đời đời kiếp kiếp không ăn thịt chúng sinh, bảo hộ muôn loài.',
        'Nguyện dùng đức Hoan Hỷ dung nhiếp kẻ oán người thân, hóa giải mọi hận thù tranh chấp.',
        'Nguyện kiến tạo cõi Ta Bà tương lai thành cảnh giới thái bình thịnh vượng, người người sống trong đạo đức và tình thương.',
        'Nguyện tiếp dẫn những ai có nhân duyên niệm Phật, tu tập ngũ giới về cõi Đâu Suất và hội Long Hoa tương lai.',
      ],
    },
    thanChu: {
      name: 'Di Lặc Bồ Tát Tâm Chú',
      sanskrit: 'Om Maitri Maitreya Maha Karuna Ye Svaha.',
      vietnamese: 'Án Mai-tơ-ri Mai-tơ-rê-da Ma Ha Ca Ru Na Dê Ta Bà Ha.',
      meaning: 'Kính lạy Đấng Từ Thị Di Lặc mang lòng Đại Bi vô biên, xin ban trải tình thương và niềm hoan hỷ thanh tịnh khắp muôn phương.',
      benefits: 'Hóa giải sân giận bực bội, nuôi dưỡng tâm hồn từ bi an lạc, chiêu cảm duyên lành may mắn, gắn kết nhân duyên với Tam Hội Long Hoa.',
    },
  },

  // 6. QUÁN THẾ ÂM BỒ TÁT
  {
    id: 'quan-the-am-bo-tat',
    name: 'Quán Thế Âm Bồ Tát',
    title: 'Đại Bi Quán Thế Âm Bồ Tát',
    sanskrit: 'Avalokiteśvara Bodhisattva',
    image: '/images/buddhas/quan-the-am-bo-tat.png',
    realm: 'Núi Phổ Đà Sơn (Potalaka) & Cõi Ta Bà',
    symbol: 'Bình tịnh thủy cam lộ, cành dương liễu mềm mại, đóa hoa sen hồng',
    tieuSu: {
      origin: 'Kinh điển căn bản: Phẩm Phổ Môn (Kinh Pháp Hoa), Kinh Lăng Nghiêm. Tiền thân Ngài trong vô lượng kiếp quá khứ đã thành Phật hiệu là Chánh Pháp Minh Như Lai.',
      story: 'Vì thương tưởng chúng sinh chìm đắm trong bể khổ trần ai, Ngài thị hiện thân Bồ Tát, ứng hóa 32 thân tướng (từ thân Phật, trời, vua, quan đến cư sĩ, đồng nam, đồng nữ) để tùy duyên cứu vớt.',
      meaning: 'Quán Thế Âm nghĩa là lắng nghe mọi âm thanh khổ đau trong thế gian để liền ứng hiện cứu độ. Cành dương liễu biểu thị cho hạnh nhẫn nhục nhu hòa; nước cam lộ biểu thị cho lòng từ bi xoa dịu tâm hồn đau khổ.',
    },
    daiNguyen: {
      summary: '12 Đại nguyện Tầm Thanh Cứu Khổ nổi tiếng:',
      vows: [
        'Nguyện khi chúng sinh gặp nạn đao binh, lửa cháy, nước trôi niệm danh hiệu liền được cứu thoát.',
        'Nguyện dẹp trừ độc trùng, ác thú, tà ma oán kết.',
        'Nguyện cho người mang tâm nhiều tham lam, sân hận, si mê niệm danh hiệu đều dứt trừ ba độc.',
        'Nguyện người cầu con trai đắc con trai phước đức, cầu con gái đắc con gái đoan trang.',
        'Nguyện khi lâm chung hiện thân tiếp dẫn vãng sinh cõi Phật an vui.',
      ],
    },
    thanChu: {
      name: 'Lục Tự Đại Minh Chân Ngôn (Mantra 6 Chữ)',
      sanskrit: 'Om Mani Padme Hum.',
      vietnamese: 'Úm Ma Ni Bát Mê Hồng (Án Ma Ni Bát Nạp Minh Hồng).',
      meaning: 'Viên ngọc báu rực sáng nở trên đài sen thanh tịnh. Sáu âm tiết tương ứng đóng chặt cánh cửa rơi vào sáu nẻo luân hồi.',
      benefits: 'Thanh lọc hoàn toàn thân khẩu ý, giải trừ nghiệp chướng ba đời, mở rộng lòng từ bi vô tận, người trì tụng được chư Phật mười phương hộ niệm.',
    },
  },

  // 7. ĐỊA TẠNG VƯƠNG BỒ TÁT
  {
    id: 'dia-tang-vuong-bo-tat',
    name: 'Địa Tạng Vương Bồ Tát',
    title: 'Đại Nguyện Địa Tạng Vương Bồ Tát',
    sanskrit: 'Kṣitigarbha Bodhisattva',
    image: '/images/buddhas/dia-tang-vuong-bo-tat.png',
    realm: 'Chốn U Minh Địa Ngục & Cõi Ta Bà',
    symbol: 'Tích trượng sáu vòng (phá tan cửa ngục), Như Ý Châu (ngọc sáng soi rọi chốn tối tăm), Bồ Đề Tọa',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Địa Tạng Bồ Tát Bổn Nguyện. Ngài là tấm gương hiếu đạo bậc nhất qua tiền thân nàng Quang Mục và cô gái Bà La Môn cứu mẹ khỏi địa ngục.',
      story: 'Trước khi Đức Phật Thích Ca nhập Niết bàn, Ngài đã ân cần phó chúc cho Bồ Tát Địa Tạng chăm sóc, giáo hóa chúng sinh cõi Ta Bà trong thời kỳ không có Phật (từ khi Thích Ca diệt độ cho đến khi Di Lặc hạ sinh).',
      meaning: 'Địa là đất dày vững chãi nâng đỡ muôn loài; Tạng là kho tàng chứa nhóm vô biên công đức lành. Cây tích trượng rung lên thức tỉnh kẻ mê, viên ngọc quý xua tan bóng tối u minh tột cùng.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Trọng Đại Tột Cùng Trong Pháp Giới:',
      vows: [
        '“Địa ngục vị không, thệ bất thành Phật. Chúng sinh độ tận, phương chứng Bồ Đề.” (Địa ngục chưa trống không thề không thành Phật. Chúng sinh độ hết mới chứng Bồ Đề).',
        'Nguyện xả thân cứu vớt những tội nhân chịu hình phạt đau đớn nhất nơi ngục A Tỳ.',
        'Nguyện gia hộ cho người hiếu thảo cầu siêu cha mẹ tổ tiên vãng sinh cõi lành.',
        'Nguyện ban cho người phụ nữ lúc sinh nở bình an, mẹ tròn con vuông.',
        'Nguyện bảo hộ người thọ trì Kinh Địa Tạng khỏi tai nạn, mất mùa, dịch bệnh, nhà cửa an ổn.',
      ],
    },
    thanChu: {
      name: 'Địa Tạng Diệt Định Nghiệp Chân Ngôn',
      sanskrit: 'Om Pramardani Svaha / Om Pramani Dhani Svaha.',
      vietnamese: 'Án, Bát-la mạt-lân đà-ninh, Ta-bà-ha.',
      meaning: 'Kính lạy Bồ Tát Địa Tạng, nguyện uy lực thần chú phá tan rào cản của những định nghiệp nặng nề nhất, chuyển hóa tâm ác thành thiện.',
      benefits: 'Giải trừ định nghiệp tiền khiên, siêu độ cửu huyền thất tổ, tiêu trừ ác mộng bóng đè, biến đất dữ thành đất lành bình an thịnh vượng.',
    },
  },

  // 8. VĂN THÙ SƯ LỢI BỒ TÁT
  {
    id: 'van-thu-su-loi-bo-tat',
    name: 'Văn Thù Sư Lợi Bồ Tát',
    title: 'Đại Trí Văn Thù Sư Lợi Bồ Tát',
    sanskrit: 'Mañjuśrī Bodhisattva (Diệu Cát Tường)',
    image: '/images/buddhas/van-thu-su-loi-bo-tat.png',
    realm: 'Thánh địa Ngũ Đài Sơn (Sơn Tây, Trung Quốc)',
    symbol: 'Gươm báu trí tuệ (trảm vô minh), kinh Bát Nhã Ba La Mật trên hoa sen xanh, cưỡi Sư tử xanh dũng mãnh',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Hoa Nghiêm, Kinh Bát Nhã, Kinh Duy Ma Cật. Ngài là vị Bồ Tát thượng thủ lãnh đạo chúng Bồ Tát, thị giả bên tả Đức Phật Thích Ca.',
      story: 'Trong quá khứ Ngài từng là thầy của vô số chư Phật, được xưng tụng là "Tam Thế Chư Phật Chi Mẫu" (Mẹ của chư Phật ba đời). Ngài biểu trưng cho Trí Tuệ thấu suốt tính Không và chân lý rốt ráo.',
      meaning: 'Thanh kiếm vung lên không phải để sát sinh mà là kiếm huệ chặt đứt mọi tơ vương phiền não, si mê; Sư tử xanh biểu thị cho sức mạnh dũng mãnh của chánh trí hàng phục mọi tà thuyết ngoại đạo.',
    },
    daiNguyen: {
      summary: '10 Đại Nguyện Trí Tuệ Khai Sáng Chánh Pháp:',
      vows: [
        'Nguyện đem ánh sáng trí tuệ Bát Nhã soi rọi cho chúng sinh đang lầm lũi trong đêm tối vô minh.',
        'Nguyện hộ trì người học Phật thấu triệt nghĩa lý sâu mầu của kinh điển Đại Thừa.',
        'Nguyện cho tất cả những ai nghe danh, thấy tướng, niệm chú của Ngài đều phát tâm Bồ Đề kiên cố.',
        'Nguyện chặt đứt mọi lưới nghi ngờ, phá tan tà kiến chấp ngã chấp pháp.',
      ],
    },
    thanChu: {
      name: 'Văn Thù Sư Lợi Tâm Chú (A Ra Pa Ca Na)',
      sanskrit: 'Om A Ra Pa Ca Na Dhih.',
      vietnamese: 'Án A La Ba Trà Na Đi (Om A Ra Pa Tsa Na Dhi).',
      meaning: 'Năm âm tiết A-Ra-Pa-Ca-Na thâu tóm toàn bộ giáo lý Bát Nhã thậm thâm; âm "Dhih" rung động đánh thức tuệ giác bừng nở.',
      benefits: 'Khai mở trí thông minh tột bực, tăng cường trí nhớ, học tập thi cử hanh thông, thấu hiểu kinh điển uyên thâm, đoạn dứt tính hay quên lẫn.',
    },
  },

  // 9. PHỔ HIỀN BỒ TÁT
  {
    id: 'pho-hien-bo-tat',
    name: 'Phổ Hiền Bồ Tát',
    title: 'Đại Hạnh Phổ Hiền Bồ Tát',
    sanskrit: 'Samantabhadra Bodhisattva (Biến Cát)',
    image: '/images/buddhas/pho-hien-bo-tat.png',
    realm: 'Thánh địa Nga Mi Sơn (Tứ Xuyên, Trung Quốc)',
    symbol: 'Cưỡi Voi trắng sáu ngà, tay cầm cành sen ngọc / như ý châu, áo giáp nhẫn nhục',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Hoa Nghiêm (Phẩm Phổ Hiền Hạnh Nguyện). Cùng với Văn Thù Sư Lợi, Ngài là thị giả bên hữu của Phật Thích Ca tạo thành Hoa Nghiêm Tam Thánh.',
      story: 'Ngài là hiện thân tối thượng của Hạnh Nguyện và Thực Hành. Nếu Bồ Tát Văn Thù đại diện cho "Trí" (suy nghĩ thấu suốt) thì Bồ Tát Phổ Hiền đại diện cho "Hành" (hành động kiên định, dấn thân không mệt mỏi).',
      meaning: 'Voi trắng sáu ngà biểu trưng cho Lục Độ Ba La Mật (Bố thí, Trì giới, Nhẫn nhục, Tinh tấn, Thiền định, Trí tuệ) vững chãi bước đi đạp bằng mọi chông gai chướng ngại.',
    },
    daiNguyen: {
      summary: 'Mười Đại Nguyện Vương trứ danh đưa hành giả về cõi Cực Lạc:',
      vows: [
        'Một là: Lễ kính chư Phật.',
        'Hai là: Xưng tán Như Lai.',
        'Ba là: Quảng tu cúng dường.',
        'Bốn là: Sám hối nghiệp chướng.',
        'Năm là: Tùy hỷ công đức.',
        'Sáu là: Thỉnh chuyển pháp luân.',
        'Bảy là: Thỉnh Phật trụ thế.',
        'Tám là: Thường tùy Phật học.',
        'Chín là: Hằng thuận chúng sinh.',
        'Mười là: Phổ giai hồi hướng khắp mười phương pháp giới.',
      ],
    },
    thanChu: {
      name: 'Phổ Hiền Bồ Tát Tâm Chú',
      sanskrit: 'Om Samantabhadra Svaha / Om Lokasamasta Sukhino Bhavantu.',
      vietnamese: 'Án Ta-mạn-đa Bạt-đà-ra Ta Bà Ha.',
      meaning: 'Kính lạy Đấng Hạnh Nguyện Toàn Hảo Phổ Hiền, nguyện mọi thiện nguyện của con đều thành tựu viên mãn phụng sự muôn loài.',
      benefits: 'Tăng trưởng ý chí dấn thân hành thiện, vượt qua tính lười biếng trì hoãn, tiêu trừ ma chướng cản trở công đức lành.',
    },
  },

  // 10. ĐẠI THẾ CHÍ BỒ TÁT
  {
    id: 'dai-the-chi-bo-tat',
    name: 'Đại Thế Chí Bồ Tát',
    title: 'Đại Lực Đại Thế Chí Bồ Tát',
    sanskrit: 'Mahāsthāmaprāpta Bodhisattva (Đắc Đại Thế)',
    image: '/images/buddhas/dai-the-chi-bo-tat.png',
    realm: 'Cõi Tây Phương Cực Lạc (Tây Phương Tam Thánh)',
    symbol: 'Hoa sen xanh thanh khiết, bình báu trên đỉnh đầu tỏa ánh sáng trí tuệ, ánh kim quang rực rỡ',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Quán Vô Lượng Thọ, Kinh Lăng Nghiêm (Chương Đại Thế Chí Niệm Phật Viên Thông).',
      story: 'Ngài đứng bên tay phải của Đức Phật A Di Đà. Ánh sáng trí tuệ của Ngài soi chiếu khắp mười phương, khiến chúng sinh ba đường ác dứt trừ thống khổ. Khi Ngài cất bước chân, chấn động cả đại thiên thế giới.',
      meaning: 'Đại Thế Chí nghĩa là dùng ánh sáng đại trí tuệ chiếu soi khắp chốn, ban cho chúng sinh sức mạnh dũng mãnh vượt qua bể khổ trầm luân.',
    },
    daiNguyen: {
      summary: 'Pháp Môn Niệm Phật Viên Thông Bậc Nhất:',
      vows: [
        'Nguyện dùng tâm niệm Phật chuyên nhất thâu nhiếp cả sáu căn, tịnh niệm nối tiếp nhau không gián đoạn.',
        'Nguyện giáo hóa chúng sinh thời mạt pháp chuyên tâm trì niệm hồng danh A Di Đà để hiện đời thấy Phật, tương lai vãng sinh.',
        'Nguyện phóng ánh đại trí quang đập tan mây mù u tối của tham dục và hận thù.',
      ],
    },
    thanChu: {
      name: 'Đại Thế Chí Bồ Tát Chân Ngôn',
      sanskrit: 'Om Sam Jam Jam Sah Svaha.',
      vietnamese: 'Án Tạm Trâm Trâm Tắc Ta Bà Ha.',
      meaning: 'Năng lực ánh sáng trí tuệ kiên cố vô tỷ của Bồ Tát Đại Thế Chí thấu suốt hư không, ban cho tâm định tĩnh kiên cường.',
      benefits: 'Xua tan sự sợ hãi hoang mang, gia tăng sức mạnh tinh tấn tu tập, giữ cho tâm hành giả không bị thối chuyển trước nghịch cảnh.',
    },
  },

  // 11. CHUẨN ĐỀ BỒ TÁT
  {
    id: 'chuan-de-bo-tat',
    name: 'Chuẩn Đề Bồ Tát',
    title: 'Thất Câu Chi Phật Mẫu Chuẩn Đề Vương Bồ Tát',
    sanskrit: 'Cundī Avalokiteśvara (Thanh Tịnh / Năng Hành)',
    image: '/images/buddhas/chuan-de-bo-tat.png',
    realm: 'Pháp giới Mật Tông Kim Cương Thừa',
    symbol: '18 Cánh tay cầm 18 pháp khí (bình nước, gương báu, hoa sen, chày kim cang...), mão miện ngũ Phật',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Phật Thuyết Thất Câu Chi Phật Mẫu Tâm Đại Chuẩn Đề Đà La Ni. Ngài được xưng tụng là "Phật Mẫu" - Mẹ của bảy trăm ức chư Phật.',
      story: 'Ngài thị hiện thân tướng sắc vàng rực rỡ ngồi trên tòa sen trắng, có 18 cánh tay biểu thị cho 18 pháp Bất Cộng của chư Phật. Ngài đại diện cho đức tính thanh tịnh nguyên thủy, chuyển hóa mọi cấu uế cõi phàm.',
      meaning: 'Chuẩn Đề là sự thanh tịnh mầu nhiệm. Lòng từ của Ngài bao dung tột bậc: dù là kẻ phá giới, người tội nặng nếu biết ăn năn trì chú đều được Ngài che chở ban phúc.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Cứu Khổ Mạt Pháp & Ban Phước Toàn Diện:',
      vows: [
        'Nguyện gia hộ cho người tại gia lẫn xuất gia đời mạt pháp tiêu trừ chướng nghiệp, tai ương, kiện cáo, tù tội.',
        'Nguyện cho người nghèo khó cầu tài được tài, cầu trường thọ được trường thọ, cầu con hiền thảo được như sở nguyện.',
        'Nguyện bảo hộ người trì chú khỏi tà thuật, trù ếm, bùa ngải ác hại.',
      ],
    },
    thanChu: {
      name: 'Chuẩn Đề Thần Chú',
      sanskrit: 'Namah Saptanam Samyaksambuddha Kotinam. Tadyatha: Om Cale Cule Cunde Svaha.',
      vietnamese: 'Khể thủ quy y Tô-tất-đế, Đầu diện đảnh lễ Thất Câu Chi. Ngã kim xưng tán Đại Chuẩn Đề, Duy nguyện từ bi thùy gia hộ. Nam mô Tát đa nẫm, Tam miệu tam bồ đề, Câu chi nẫm, Đát điệt tha: Án, Chiết lệ chủ lệ Chuẩn Đề, Ta bà ha.',
      meaning: 'Cúi đầu quy kính chư Phật ba đời và Đức Phật Mẫu Chuẩn Đề, cầu xin oai thần tối thắng chuyển hóa mọi tai ương thành cát tường như ý.',
      benefits: 'Rất linh nghiệm, tiêu trừ tội chướng sâu dày, gia đạo bình an hưng vượng, tăng trưởng tuổi thọ và phúc báo, mọi việc hanh thông.',
    },
  },

  // 12. ĐẠI NHẬT NHƯ LAI
  {
    id: 'dai-nhat-nhu-lai',
    name: 'Đại Nhật Như Lai',
    title: 'Pháp Thân Tối Cao Tỳ Lô Giá Na Phật',
    sanskrit: 'Mahāvairocana Tathāgata',
    image: '/images/buddhas/dai-nhat-nhu-lai.png',
    realm: 'Mật Cương Giới & Thai Tạng Giới (Chân Ngôn Tông)',
    symbol: 'Trí Quyền Ấn (Bodhishri Mudra), vầng hào quang mặt trời chiếu khắp vũ trụ, Kim Cương Luân',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Đại Nhật (Mahāvairocana Sūtra), Kinh Kim Cương Đỉnh. Ngài là vị Phật Bản Tôn tối thượng của Mật Tông Kim Cương Thừa.',
      story: 'Ngài là Pháp Thân Phật (Dharmakaya) của muôn loài, là cội nguồn của toàn thể vũ trụ pháp giới. Trí tuệ quang minh của Ngài khác hẳn mặt trời thế gian: mặt trời thế gian chỉ chiếu sáng ban ngày và bị mây che, còn trí tuệ Đại Nhật Như Lai bình đẳng chiếu soi khắp không gian thời gian không ngăn ngại.',
      meaning: 'Đại Nhật là vầng mặt trời vĩ đại của Trí Tuệ Thể Tính, chuyển hóa năm loại độc tố (tham, sân, si, mạn, nghi) thành Ngũ Trí Như Lai vi diệu.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Khai Mở Trí Tuệ Kim Cương Bất Hoại:',
      vows: [
        'Nguyện bao dung tất cả chúng sinh trong cảnh giới Pháp thân thanh tịnh thường hằng.',
        'Nguyện ban phát ánh sáng trí tuệ diệt trừ hoàn toàn gốc rễ vô minh và bóng tối chấp ngã.',
        'Nguyện đưa muôn loài đạt đến quả vị "Tức Thân Thành Phật" (ngay nơi thân này chứng ngộ Phật tính).',
      ],
    },
    thanChu: {
      name: 'Quang Minh Chân Ngôn (Đại Nhật Chân Ngôn)',
      sanskrit: 'Om Amogha Vairochana Mahamudra Manipadma Jvala Pravarttaya Hum.',
      vietnamese: 'Án A-mô-già Vỹ-lô-tả-nẵng Ma-ha Mẫu-nại-la Ma-ni Bát-nạp-mạ Nhập-phạ-la Bát-la-vạt-đa-dã Hồng.',
      meaning: 'Quy mạng Đấng Đại Nhật Như Lai bất biến toàn năng, nguyện ánh sáng ngọc ma ni hoa sen rực cháy chiếu rọi phá tan mọi u ám luân hồi.',
      benefits: 'Người nghe, đọc hoặc rải cát trì tụng chú này lên phần mộ người quá cố thì hương linh liền thoát khỏi khổ ải ba đường ác, vãng sinh cõi Phật.',
    },
  },

  // 13. TÔN GIẢ MA HA CA DIẾP
  {
    id: 'ton-gia-ma-ha-ca-diep',
    name: 'Tôn giả Ma Ha Ca Diếp',
    title: 'Đầu Đà Đệ Nhất Ma Ha Ca Diếp Tôn Giả',
    sanskrit: 'Mahākāśyapa Thera',
    image: '/images/buddhas/ton-gia-ma-ha-ca-diep.png',
    realm: 'Tăng đoàn thời Đức Phật & Núi Kê Túc (Ấn Độ)',
    symbol: 'Chiếc áo phấn tảo vá trăm mảnh, bình bát khất thực giản dị, đóa hoa sen Niêm Hoa Vi Tiếu',
    tieuSu: {
      origin: 'Xuất thân quý tộc Bà La Môn giàu có bậc nhất xứ Ma Kiệt Đà, cùng vợ xuất gia cầu đạo giải thoát, trở thành một trong Thập Đại Đệ Tử của Đức Phật.',
      story: 'Ngài là Sơ Tổ Thiền Tông Ấn Độ qua điển tích lịch sử "Niêm Hoa Vi Tiếu" tại Linh Sơn Hội: Đức Phật giơ cành hoa sen, đại chúng ngơ ngác, chỉ riêng Tôn giả Ca Diếp mỉm cười thấu triệt tâm truyền tâm. Sau khi Phật nhập diệt, Tôn giả chủ trì cuộc Kết Tập Kinh Điển lần thứ nhất tại hang Thất Diệp.',
      meaning: 'Đầu Đà Đệ Nhất biểu trưng cho đức hạnh khổ hạnh tuyệt đối, sống đời thanh bạch giải thoát, xả ly hoàn toàn bụi trần danh lợi.',
    },
    daiNguyen: {
      summary: 'Đại Hạnh Giữ Gìn Giềng Mối Chánh Pháp Thanh Tịnh:',
      vows: [
        'Nguyện trọn đời trì giữ 13 hạnh Đầu đà thanh bần: mặc áo chắp vá nghĩa địa, ngày ăn một bữa, ngủ dưới gốc cây.',
        'Nguyện lưu giữ nguyên vẹn lời Phật dạy truyền trao cho muôn thế hệ mai sau.',
        'Nguyện nhập định nơi núi Kê Túc bảo bọc y bát của Đức Thế Tôn cho đến ngày Phật Di Lặc hạ sinh.',
      ],
    },
    thanChu: {
      name: 'Kệ Truyền Pháp Thiền Sơ Tổ',
      sanskrit: 'Dharmata Shunya Nirmala Svaha.',
      vietnamese: 'Pháp bản pháp vô pháp, Vô pháp pháp diệc pháp. Kim phó vô pháp thời, Pháp pháp hà tằng pháp.',
      meaning: 'Bản chất giáo pháp vốn không có pháp cố định, không chấp vào tướng pháp mới thấy được chân pháp nguyên thủy.',
      benefits: 'Đoạn trừ thói quen xa hoa lãng phí, nuôi dưỡng tâm hồn giản dị thanh bần, định tĩnh nội tâm trước phong ba cám dỗ.',
    },
  },

  // 14. TÔN GIẢ A NAN ĐÀ
  {
    id: 'ton-gia-a-nan-da',
    name: 'Tôn giả A Nan Đà',
    title: 'Đa Văn Đệ Nhất A Nan Đà Tôn Giả',
    sanskrit: 'Ānanda Thera (Hoan Hỷ)',
    image: '/images/buddhas/ton-gia-a-nan-da.png',
    realm: 'Thị giả của Đức Thế Tôn & Nhị Tổ Thiền Tông Ấn Độ',
    symbol: 'Tập kinh bối diệp (kinh chép trên lá bối), gương mặt thanh tú hoan hỷ, bút mực lưu truyền chánh pháp',
    tieuSu: {
      origin: 'Em họ của Phật Thích Ca, sinh vào đêm Phật thành đạo. Tên Ngài nghĩa là Hoan Hỷ vì dung mạo tuấn tú và đức tính hiền hòa khiến ai nhìn thấy cũng hoan hỷ.',
      story: 'Ngài làm thị giả thân cận của Đức Phật suốt 25 năm, phục vụ chu đáo như bóng với hình. Ngài có trí nhớ siêu việt, nghe Phật thuyết pháp một lần là nhớ trọn vẹn từng lời không sót. Trong kỳ Kết tập kinh điển thứ nhất, Tôn giả trùng tuyên lại toàn bộ Kinh tạng.',
      meaning: 'Đa Văn Đệ Nhất là biểu tượng của tinh thần hiếu học, lắng nghe chân thành, tận tụy hy sinh vì đại chúng và mở đường cho Ni đoàn thành lập.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Phụng Sự & Truyền Tải Kim Ngôn Của Phật:',
      vows: [
        'Nguyện tận tâm phục vụ Đức Thế Tôn và chư Tăng không một niệm mệt mỏi.',
        'Nguyện ghi nhớ toàn vẹn mọi lời kinh Phật dạy để muôn đời sau chúng sinh có kim chỉ nam tu học.',
        'Nguyện xin Đức Phật cho phép nữ giới xuất gia thành lập giáo đoàn Tỳ kheo ni bình đẳng giải thoát.',
      ],
    },
    thanChu: {
      name: 'Kệ Tán Thán Lăng Nghiêm Của Tôn Giả A Nan',
      sanskrit: 'Namo Shakyamunaye, Namo Anandaya Bodhisattvaya Svaha.',
      vietnamese: 'Diệu trạm tổng trì bất động tôn, Thủ Lăng Nghiêm Vương thế hy hữu. Tiêu ngã ức kiếp điên đảo tưởng, Bất lịch tăng kỳ hoạch pháp thân.',
      meaning: 'Kính lạy Đấng Diệu Trạm Bất Động Tôn, bài kinh Thủ Lăng Nghiêm hy hữu diệt trừ ức kiếp vọng tưởng điên đảo của con.',
      benefits: 'Tăng cường trí nhớ tuyệt luân, khai thông tâm trí, học hỏi Phật pháp tinh tấn, nuôi dưỡng đức tính khiêm nhường hòa ái.',
    },
  },

  // 15. TỔ SƯ BỒ ĐỀ ĐẠT MA
  {
    id: 'to-su-bo-de-dat-ma',
    name: 'Tổ sư Bồ Đề Đạt Ma',
    title: 'Sơ Tổ Thiền Tông Đông Độ Bồ Đề Đạt Ma',
    sanskrit: 'Bodhidharma (Đạt Ma Sư Tổ)',
    image: '/images/buddhas/to-su-bo-de-dat-ma.png',
    realm: 'Chùa Thiếu Lâm (Núi Tung Sơn, Trung Hoa)',
    symbol: 'Áo nâu sồng, đôi mắt quắc thước rực sáng, gậy trúc quảy một chiếc giày, chín năm diện bích',
    tieuSu: {
      origin: 'Hoàng tử thứ ba của quốc vương xứ Kanchipuram (Nam Ấn Độ). Đắc pháp với Tổ Bát Nhã Đa La, trở thành vị Tổ thứ 28 của Thiền Tông Ấn Độ.',
      story: 'Vâng lời thầy, Ngài vượt sóng trùng dương sang Trung Hoa hoằng pháp. Sau cuộc đối thoại "Không có chút công đức nào" với Lương Vũ Đế, Ngài quảy một chiếc giày qua sông Trường Giang lên núi Tung Sơn, ngồi thiền diện bích 9 năm ròng rã, truyền y bát cho Nhị Tổ Huệ Khả.',
      meaning: 'Sơ Tổ Thiền Tông Đông Độ, người mở ra dòng thiền "Bất lập văn tự - Giáo ngoại biệt truyền - Trực chỉ nhân tâm - Kiến tính thành Phật".',
    },
    daiNguyen: {
      summary: 'Tâm Pháp Trực Chỉ Ngộ Nhập Chân Tính:',
      vows: [
        'Nguyện dẫn dắt hành giả vượt qua lớp vỏ chữ nghĩa giáo điều để nhận diện bản tâm Phật tính thanh tịnh vốn sẵn đủ.',
        'Nguyện truyền trao tâm ấn Thiền Tông nối dài mạch nguồn chánh pháp giác ngộ.',
        'Nguyện rèn đúc ý chí sắt đá kiên cường, coi nghịch cảnh là mảnh đất màu mỡ trui rèn đạo quả.',
      ],
    },
    thanChu: {
      name: 'Đạt Ma Sư Tổ Tâm Pháp Chân Ngôn',
      sanskrit: 'Om Bodhidharma Maha Guru Hum Phat.',
      vietnamese: 'Án Bồ Đề Đạt Ma Ma Ha Cư Sư Hồng Phách.',
      meaning: 'Kính lạy Đại Sư Tổ Bồ Đề Đạt Ma, xin uy lực kim cương chém đứt mọi tạp niệm phân biệt, đốn ngộ tự tính chân như.',
      benefits: 'Xua tan tính khiếp nhược sợ hãi, tôi luyện ý chí kiên định phi thường, dứt trừ vọng tưởng tạp loạn khi ngồi thiền tọa.',
    },
  },

  // 16. VI ĐÀ TÔN THIÊN BỒ TÁT
  {
    id: 'vi-da-ton-thien-bo-tat',
    name: 'Vi Đà Tôn Thiên Bồ Tát',
    title: 'Hộ Pháp Vi Đà Tôn Thiên Bồ Tát',
    sanskrit: 'Skanda Bodhisattva (Vi Đà Thiên Tướng)',
    image: '/images/buddhas/vi-da-ton-thien-bo-tat.png',
    realm: 'Chốn Thiền Môn Tự Viện Mười Phương',
    symbol: 'Áo giáp vàng sáng loáng, chày Kim Cang (Vajra) trấn giữ thiền môn, tư thế uy nghiêm dũng mãnh',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Đại Bảo Tích, Kinh Niết Bàn. Ngài là đại tướng quân thống lĩnh ba mươi hai thiên tướng dưới quyền Tứ Đại Thiên Vương.',
      story: 'Khi Đức Phật nhập Niết bàn, quỷ Tiệp Tật La sát trộm mất xá lợi răng Phật. Tôn giả Vi Đà lập tức bay nhanh như chớp đuổi theo bắt quỷ đoạt lại ngọc xá lợi cúng dường chư Thiên. Chư Phật khen ngợi và giao phó cho Ngài sứ mệnh hộ trì thiền môn.',
      meaning: 'Biểu tượng của đức Hộ Trì và Dũng Lực bất khuất. Nơi nào có đạo tràng thanh tịnh tu học thì nơi đó có Bồ Tát Vi Đà ngự giá bảo bọc.',
    },
    daiNguyen: {
      summary: 'Đại Nguyện Hộ Trì Chánh Pháp & Tăng Chúng:',
      vows: [
        'Nguyện bảo vệ nơi thờ tự Tam Bảo không cho ma vương tà khí xâm phạm quấy nhiễu.',
        'Nguyện hộ trì người chân chánh tu học dẫu cách ngàn trùng xa xôi cũng đến bảo bọc.',
        'Nguyện dẹp tan tà giáo phá hoại kinh điển và quy củ thiền môn.',
      ],
    },
    thanChu: {
      name: 'Vi Đà Bồ Tát Hộ Pháp Thần Chú',
      sanskrit: 'Om Veda Tintha Maha Tintha Svaha.',
      vietnamese: 'Án Vi Đà Thiên Đà Ma Ha Thiên Đà Ta Bà Ha.',
      meaning: 'Kính lễ Bồ Tát Vi Đà Thiên Tướng tối thắng, nguyện oai lực chánh pháp trấn giữ bình an cho chốn thiền lâm.',
      benefits: 'Trấn trạch trừ tà, xua đuổi kẻ gian ác quấy phá, bảo vệ hành giả an tâm tu hành, tài vật không bị hao hụt mất mát.',
    },
  },

  // 17. KIM CANG THỦ BỒ TÁT
  {
    id: 'kim-cang-thu-bo-tat',
    name: 'Kim Cang Thủ Bồ Tát',
    title: 'Bí Mật Chủ Kim Cang Thủ Bồ Tát',
    sanskrit: 'Vajrapāṇi Bodhisattva (Bậc Cầm Chày Kim Cương)',
    image: '/images/buddhas/kim-cang-thu-bo-tat.png',
    realm: 'Pháp giới Mật Giáo Kim Cương Thừa',
    symbol: 'Chày Kim Cang (Vajra) năm chấu, vòng lửa trí tuệ rực cháy thiêu rụi tà ma, sắc thân xanh lam phẫn nộ',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Đại Nhật, Mật Tạng Mật Điển. Ngài cùng với Quán Thế Âm (Đại Bi) và Văn Thù (Đại Trí) hợp thành Tam Tộc Tính Bồ Tát tối cao của Mật Tông.',
      story: 'Ngài là biểu trưng cho Đại Lực và Năng Lực Bất Khả Xâm Phạm của toàn thể chư Phật. Ngài luôn đi theo bên cạnh bảo vệ Đức Thế Tôn Thích Ca trước mọi mưu toan ám hại của Đề Bà Đạt Đa và ma quân.',
      meaning: 'Hình tướng phẫn nộ với mắt trợn tròn, vòng lửa rực sáng không phải là giận dữ trần tục mà là ngọn lửa Trí Tuệ thiêu rụi triệt để gốc rễ si mê, độc hại, bẻ gãy mọi kiêu ngạo tà kiến.',
    },
    daiNguyen: {
      summary: 'Đại Lực Hàng Phục Ma Chướng & Bảo Hộ Mật Tạng:',
      vows: [
        'Nguyện đập tan mọi chướng ngại ma vương bên ngoài và độc tố tham sân si bên trong tâm hành giả.',
        'Nguyện bảo hộ kho tàng Mật điển bí yếu của chư Phật không để rơi vào tay kẻ bất thiện.',
        'Nguyện ban cho người chân tu ý chí kiên cố sắc bén như kim cương không gì phá vỡ nổi.',
      ],
    },
    thanChu: {
      name: 'Kim Cang Thủ Tâm Chú',
      sanskrit: 'Om Vajrapani Hum Phat.',
      vietnamese: 'Án Oa-giơ-ra-pa-ni Hum Phách (Om Vajrapani Hum Phat).',
      meaning: 'Nguyện năng lực sấm sét của chày Kim Cang hàng phục mọi thế lực tà ám, quét sạch phiền não chướng ngại.',
      benefits: 'Gia trì oai lực vô úy, trừ khử bệnh tật do tà khí độc hại, tăng cường sinh khí và ý chí nội tâm kiên cường vượt bực.',
    },
  },

  // 18. ĐỨC TARA (ĐA LA BỒ TÁT)
  {
    id: 'duc-tara-da-la-bo-tat',
    name: 'Đức Tara (Đa La Bồ Tát)',
    title: 'Thánh Độ Mẫu Đa La Bồ Tát',
    sanskrit: 'Ārya Tārā (Ngôi Sao Cứu Độ / Mẹ Cứu Vớt)',
    image: '/images/buddhas/duc-tara-da-la-bo-tat.png',
    realm: 'Cõi Tịnh Thổ Hoa Sen Mật Tông',
    symbol: 'Bông sen xanh Utpala hé nở trên tay, một chân duỗi sẵn sàng đứng dậy cứu độ, dung mạo từ ái tuyệt mỹ',
    tieuSu: {
      origin: 'Kinh điển căn bản: Kinh Đa La Bồ Tát Cứu Khổ Đà La Ni, Mật Tạng Tạng Truyền. Tôn xưng là "Mẹ của mọi sự cứu độ mau chóng".',
      story: 'Tương truyền Ngài sinh ra từ giọt nước mắt đại bi của Bồ Tát Quán Thế Âm khi quán chiếu nỗi khổ trầm luân vô tận của chúng sinh. Ngài phát đại nguyện: "Người ta thường mong cầu thân nam để giải thoát, nhưng con nguyện dùng thân nữ để hóa độ muôn loài cho đến khi cõi luân hồi trống rỗng".',
      meaning: 'Một chân co thiền định, một chân duỗi ra biểu thị tư thế luôn sẵn sàng phóng mình xuống trần gian để tiếp cứu chúng sinh trong tích tắc khi nghe tiếng kêu cầu.',
    },
    daiNguyen: {
      summary: 'Cứu Vớt Khỏi Tám Mối Nguy Hiểm Lớn (Bát Nạn):',
      vows: [
        'Cứu khỏi nạn Sư tử (tượng trưng cho Kiêu mạn).',
        'Cứu khỏi nạn Voi dữ (tượng trưng cho Si mê).',
        'Cứu khỏi nạn Lửa cháy (tượng trưng cho Sân hận).',
        'Cứu khỏi nạn Rắn độc (tượng trưng cho Đố kỵ).',
        'Cứu khỏi nạn Trộm cướp (tượng trưng cho Tà kiến).',
        'Cứu khỏi nạn Giam cầm xiềng xích (tượng trưng cho Keo kiệt tham lam).',
        'Cứu khỏi nạn Lụt trôi (tượng trưng cho Tham ái đắm chìm).',
        'Cứu khỏi nạn Quỷ dữ ác ma (tượng trưng cho Nghi ngờ chánh pháp).',
      ],
    },
    thanChu: {
      name: 'Thánh Độ Mẫu Tara Tâm Chú',
      sanskrit: 'Om Tare Tuttare Ture Svaha.',
      vietnamese: 'Úm Ta-rê Tu-ta-rê Tu-rê So-ha.',
      meaning: 'Tare giải thoát nỗi sợ thế gian; Tuttare giải thoát khỏi tám mối nguy tâm thức; Ture dẫn dắt tới bờ giác ngộ giải thoát tối hậu.',
      benefits: 'Cứu nạn cấp bách, xua tan ác mộng và sự hoảng sợ, tăng trưởng sự bình an diệu kỳ, nhan sắc đoan trang, trường thọ và vạn sự cát tường.',
    },
  },
];

