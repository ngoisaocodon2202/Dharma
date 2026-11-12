// Tuyển tập 36 Kệ Kinh Pháp Cú (Dhammapada) — Việt dịch Hòa thượng Thích Minh Châu & Chú giải Thực hành

export interface DhammapadaVerse {
  id: number;
  verseNumber: string;
  chapter: string;
  paliOpening?: string;
  verse: string;
  meaning: string;
  practiceGuidance: string;
}

export const DHAMMAPADA_VERSES: DhammapadaVerse[] = [
  {
    id: 1,
    verseNumber: 'Kệ số 1',
    chapter: 'Phẩm Song Yếu (Yamaka Vagga)',
    paliOpening: 'Manopubbangama dhamma...',
    verse:
      'Ý dẫn đầu các pháp, ý làm chủ, ý tạo. Nếu với ý ô nhiễm, nói lên hay hành động, khổ não bước theo sau, như xe chân vật kéo.',
    meaning:
      'Mọi vui buồn, sướng khổ của đời người đều khởi nguồn từ tâm ý. Khi ta hành động trong cơn giận dữ hay tham lam, hệ quả bất an tất yếu theo sau không rời.',
    practiceGuidance: 'Quan sát ý niệm khởi đầu trước khi cất lời hay hành động trong ngày hôm nay.',
  },
  {
    id: 2,
    verseNumber: 'Kệ số 2',
    chapter: 'Phẩm Song Yếu (Yamaka Vagga)',
    paliOpening: 'Manasā ce pasannena...',
    verse:
      'Ý dẫn đầu các pháp, ý làm chủ, ý tạo. Nếu với ý thanh tịnh, nói lên hay hành động, an lạc bước theo sau, như bóng không rời hình.',
    meaning:
      'Một tâm ý trong sáng, thiện lương và bình tĩnh tự khắc chiêu cảm bình an bền vững trong đời sống thường nhật.',
    practiceGuidance: 'Mỗi sáng khởi một thiện nguyện hiền hòa trước khi bắt đầu công việc.',
  },
  {
    id: 3,
    verseNumber: 'Kệ số 5',
    chapter: 'Phẩm Song Yếu (Yamaka Vagga)',
    verse:
      'Với hận diệt hận thù, đời này không có được. Không hận diệt hận thù, là định luật ngàn thu.',
    meaning:
      'Đáp trả tổn thương bằng oán hận chỉ khiến vòng xoáy khổ đau kéo dài. Chỉ có từ bi và thấu hiểu mới hóa giải tận gốc sự bất hòa.',
    practiceGuidance: 'Khi gặp người trái ý, hít sâu 3 hơi và đáp lại bằng thái độ điềm tĩnh, không hơn thua.',
  },
  {
    id: 4,
    verseNumber: 'Kệ số 21',
    chapter: 'Phẩm Không Phóng Dật (Appamāda Vagga)',
    verse:
      'Không phóng dật, đường sống. Phóng dật là đường chết. Không phóng dật, không chết. Phóng dật như thây ma.',
    meaning:
      'Sống có chánh niệm, tỉnh thức trong từng phút giây là sống trọn vẹn thật sự; ngược lại, buông thả tâm theo thói quen mù quáng là đánh mất sinh mệnh tinh thần.',
    practiceGuidance: 'Đặt nhắc nhở trở về với hơi thở tỉnh thức ít nhất 3 lần trong ngày làm việc.',
  },
  {
    id: 5,
    verseNumber: 'Kệ số 24',
    chapter: 'Phẩm Không Phóng Dật (Appamāda Vagga)',
    verse:
      'Nỗ lực giữ chánh niệm, tịnh hạnh, tự điều phục, thận trọng, sống đúng pháp, bậc trí tiếng thơm tăng.',
    meaning:
      'Sự trưởng thành nội tâm không đến từ may rủi mà kết tinh từ kỷ luật nhẹ nhàng và đời sống chính trực mỗi ngày.',
    practiceGuidance: 'Giữ trọn một lời hứa nhỏ và hoàn thành một việc thiết thực với toàn bộ sự chú tâm.',
  },
  {
    id: 6,
    verseNumber: 'Kệ số 33',
    chapter: 'Phẩm Tâm Ý (Citta Vagga)',
    verse:
      'Tâm hoảng hốt dao động, khó hộ trì, khó nhiếp. Người trí làm tâm thẳng, như thợ tên nắn tên.',
    meaning:
      'Tâm thức con người vốn hay nhảy nhót theo ngoại cảnh; thiền tập là nghệ thuật kiên nhẫn đưa tâm trở về ngay ngắn, vững vàng.',
    practiceGuidance: 'Ngồi yên 5 phút quan sát từng suy nghĩ đến rồi đi mà không phán xét.',
  },
  {
    id: 7,
    verseNumber: 'Kệ số 35',
    chapter: 'Phẩm Tâm Ý (Citta Vagga)',
    verse:
      'Khó nắm giữ, khinh động, theo các dục quay cuồng, lành thay, điều phục tâm; tâm điều, an lạc đến.',
    meaning:
      'Người chiến thắng cảm xúc bốc đồng của chính mình luôn tìm thấy sự tự do và an lạc ngay giữa bộn bề nhân thế.',
    practiceGuidance: 'Khoan vội phản ứng trong 10 giây đầu tiên khi có tin nhắn hay sự cố bất ngờ.',
  },
  {
    id: 8,
    verseNumber: 'Kệ số 49',
    chapter: 'Phẩm Hoa Hương (Puppha Vagga)',
    verse:
      'Như ong tìm hoa hương, không hại sắc, hại mùi, lấy hương rồi bay đi; bậc Thánh vào làng vậy.',
    meaning:
      'Sống giữa cuộc đời biết chọn lọc điều thiện lành để học hỏi, giữ tâm khiêm hạ và không gây phiền hà cho cộng đồng.',
    practiceGuidance: 'Chỉ mang theo điều tốt đẹp khi rời khỏi một cuộc trò chuyện hay hội họp.',
  },
  {
    id: 9,
    verseNumber: 'Kệ số 50',
    chapter: 'Phẩm Hoa Hương (Puppha Vagga)',
    verse:
      'Không nên nhìn lỗi người, người làm hay không làm. Nên tự nhìn thân tâm, đã làm hay chưa làm.',
    meaning:
      'Soi rọi và sửa mình mang lại năng lượng chuyển hóa nhanh hơn gấp trăm lần việc đi tìm khuyết điểm nơi tha nhân.',
    practiceGuidance: 'Hôm nay thực tập tạm ngưng phê bình một người khác để nhìn lại thói quen của chính mình.',
  },
  {
    id: 10,
    verseNumber: 'Kệ số 54',
    chapter: 'Phẩm Hoa Hương (Puppha Vagga)',
    verse:
      'Hương các loài hoa thơm, không bay ngược chiều gió. Nhưng hương người đức hạnh, ngược gió khắp tung bay.',
    meaning:
      'Nhân cách thanh cao và lòng chân thành lan tỏa bền bỉ, vượt qua mọi khoảng cách không gian và thị phi.',
    practiceGuidance: 'Thực hiện một hành động tử tế thầm lặng hôm nay không cần ai biết.',
  },
  {
    id: 11,
    verseNumber: 'Kệ số 60',
    chapter: 'Phẩm Kẻ Ngu (Bāla Vagga)',
    verse:
      'Đêm dài với kẻ thức, đường dài với kẻ mệt. Luân hồi dài kẻ ngu, không biết chân diệu pháp.',
    meaning:
      'Khi tâm còn vướng mắc chấp trước, một đêm trôi qua cũng dài đằng đẵng; hiểu thấu lẽ vô thường giúp tâm nhẹ bước.',
    practiceGuidance: 'Buông bớt một mối lo chưa xảy ra trước giờ đi ngủ tối nay.',
  },
  {
    id: 12,
    verseNumber: 'Kệ số 76',
    chapter: 'Phẩm Hiền Trí (Pandita Vagga)',
    verse:
      'Hãy xem bậc hiền trí, như người chỉ chôn vàng, chỉ lỗi và khiển trách. Hãy thân bậc trí ấy; thân người ấy tốt hơn, không bao giờ xấu đi.',
    meaning:
      'Lời góp ý chân thành từ thiện tri thức là kho báu quý hơn vàng ròng giúp ta trưởng thành vững chãi.',
    practiceGuidance: 'Lắng nghe trọn vẹn một lời khuyên chân tình với tâm biết ơn.',
  },
  {
    id: 13,
    verseNumber: 'Kệ số 80',
    chapter: 'Phẩm Hiền Trí (Pandita Vagga)',
    verse:
      'Người dẫn thủy dẫn nước, kẻ làm tên nắn tên, người thợ mộc uốn gỗ, bậc trí nhiếp phục tâm.',
    meaning:
      'Mọi nghề thủ công đều đòi hỏi sự rèn luyện tỉ mỉ; công phu rèn tâm cũng cần sự kiên trì đều đặn mỗi ngày.',
    practiceGuidance: 'Duy trì đều đặn một thời công phu ngắn 10 phút thay vì chờ lúc rảnh rỗi.',
  },
  {
    id: 14,
    verseNumber: 'Kệ số 81',
    chapter: 'Phẩm Hiền Trí (Pandita Vagga)',
    verse:
      'Như tảng đá kiên cố, không gió nào lay động. Cũng vậy, giữa khen chê, người trí không dao động.',
    meaning:
      'Sự vững chãi của nội tâm giúp ta không tự mãn khi được tán dương và không suy sụp khi gặp lời chê trách.',
    practiceGuidance: 'Nhớ lời dạy tám ngọn gió đời để giữ bình thản trước lời khen tiếng chê.',
  },
  {
    id: 15,
    verseNumber: 'Kệ số 93',
    chapter: 'Phẩm A La Hán (Arahanta Vagga)',
    verse:
      'Với ai lậu hoặc diệt, ăn uống không tham đắm, hành xứ thuộc giải thoát, Không Vô Tướng tự tại, bước đi thật khó thấy, như chim giữa hư không.',
    meaning:
      'Người sống tri túc, ít dục biết đủ tâm luôn thanh thản, không để dấu vết ràng buộc nặng nề phía sau.',
    practiceGuidance: 'Ăn một bữa cơm trong chánh niệm, tri ân nông dân và vạn duyên kết thành hạt gạo.',
  },
  {
    id: 16,
    verseNumber: 'Kệ số 103',
    chapter: 'Phẩm Ngàn (Sahassa Vagga)',
    verse:
      'Dầu tại bãi chiến trường, thắng ngàn ngàn quân địch. Tự thắng mình tốt hơn, thật chiến thắng tối thượng.',
    meaning:
      'Chiến công vĩ đại nhất đời người không nằm ở việc chinh phục bên ngoài mà ở khả năng làm chủ cơn giận và lòng tham của bản thân.',
    practiceGuidance: 'Nhận diện và mỉm cười hóa giải một cơn bực dọc thoáng qua trong ngày.',
  },
  {
    id: 17,
    verseNumber: 'Kệ số 109',
    chapter: 'Phẩm Ngàn (Sahassa Vagga)',
    verse:
      'Người thường biết tôn kính, kính trọng bậc trưởng thượng, bốn pháp được tăng trưởng: Thọ, Sắc, An, và Lực.',
    meaning:
      'Lòng hiếu kính, khiêm nhường với cha mẹ và bậc tôn trưởng nuôi dưỡng phúc đức, dung mạo hòa nhã và sức khỏe bền lâu.',
    practiceGuidance: 'Gọi điện hỏi thăm cha mẹ hoặc bậc trưởng bối với giọng nói ấm áp.',
  },
  {
    id: 18,
    verseNumber: 'Kệ số 121',
    chapter: 'Phẩm Ác (Pāpa Vagga)',
    verse:
      'Chớ khinh điều ác nhỏ, cho rằng chưa đến mình. Như nước nhỏ từng giọt, rồi bình cũng đầy tràn.',
    meaning:
      'Thói quen bất thiện nhỏ nếu lặp lại mỗi ngày sẽ tích tụ thành nghiệp chướng lớn; cần tỉnh táo sửa ngay từ mầm nhỏ.',
    practiceGuidance: 'Chú ý kiểm soát từng câu nói nhỏ để không vô tình gây tổn thương.',
  },
  {
    id: 19,
    verseNumber: 'Kệ số 122',
    chapter: 'Phẩm Ác (Pāpa Vagga)',
    verse:
      'Chớ khinh điều thiện nhỏ, cho rằng chưa đến mình. Như nước nhỏ từng giọt, rồi bình cũng đầy tràn.',
    meaning:
      'Đừng ngại việc lành tuy bé nhỏ như một nụ cười, một câu nhường nhịn hay một đồng bố thí — góp gió sẽ thành bão phước lành.',
    practiceGuidance: 'Gieo một hạt giống thiện lành nhỏ bé ngay hôm nay.',
  },
  {
    id: 20,
    verseNumber: 'Kệ số 129',
    chapter: 'Phẩm Hình Phạt (Danda Vagga)',
    verse:
      'Mọi người đều sợ gậy, mọi người đều sợ chết. Lấy mình làm ví dụ, không giết, không bảo giết.',
    meaning:
      'Muôn loài đều khao khát sự sống an lành. Đặt mình vào hoàn cảnh của sinh linh khác là cội nguồn của lòng từ bi chân thật.',
    practiceGuidance: 'Phát tâm dùng một bữa chay thanh đạm để nuôi dưỡng lòng từ đối với muôn loài.',
  },
  {
    id: 21,
    verseNumber: 'Kệ số 153',
    chapter: 'Phẩm Già (Jarā Vagga)',
    verse:
      'Lang thang bao kiếp sống, ta tìm nhưng chẳng gặp, người thợ xây nhà này; khổ thay phải tái sanh.',
    meaning:
      'Những câu kệ giác ngộ đầu tiên Đức Phật thốt lên dưới cội Bồ Đề nhắc ta quay về nhận diện ái dục đang kiến tạo khổ đau.',
    practiceGuidance: 'Phân biệt giữa nhu cầu thật sự và mong muốn dư thừa hôm nay.',
  },
  {
    id: 22,
    verseNumber: 'Kệ số 160',
    chapter: 'Phẩm Tự Ngã (Atta Vagga)',
    verse:
      'Tự mình y tựa mình, nào có y tựa khác. Nhờ khéo điều phục mình, được chỗ tựa khó được.',
    meaning:
      'Ngoại cảnh chỉ là trợ duyên; sự bình an vững chắc nhất luôn phải được xây dựng từ chính nội lực tu tập của bản thân.',
    practiceGuidance: 'Tự thắp sáng ngọn đèn chánh niệm khi đối diện thử thách độc lập.',
  },
  {
    id: 23,
    verseNumber: 'Kệ số 172',
    chapter: 'Phẩm Thế Gian (Loka Vagga)',
    verse:
      'Ai trước sống phóng dật, sau sống không phóng dật, người ấy chói sáng đời, như trăng thoát mây che.',
    meaning:
      'Quá khứ lầm lỗi không quyết định tương lai nếu hôm nay ta biết quay đầu tỉnh thức và tinh tấn sửa đổi.',
    practiceGuidance: 'Tin tưởng vào khả năng chuyển hóa tươi mới nơi chính bản thân.',
  },
  {
    id: 24,
    verseNumber: 'Kệ số 183',
    chapter: 'Phẩm Phật Đà (Buddha Vagga)',
    verse:
      'Không làm mọi điều ác, thành tựu các hạnh lành, tâm ý giữ trong sạch, chính lời chư Phật dạy.',
    meaning:
      'Thất Phật Thông Giới Kệ — Ba dòng tóm tắt trọn vẹn con đường tu học của hết thảy chư Phật ba đời.',
    practiceGuidance: 'Lấy ba câu kệ này làm kim chỉ nam soi chiếu mọi quyết định trong ngày.',
  },
  {
    id: 25,
    verseNumber: 'Kệ số 197',
    chapter: 'Phẩm An Lạc (Sukha Vagga)',
    verse:
      'Vui thay, chúng ta sống, không hận giữa hận thù. Giữa những người thù hận, ta sống không hận thù.',
    meaning:
      'Bình an không đòi hỏi cả thế giới đều hoàn hảo, mà bắt đầu từ một trái tim không nuôi dưỡng oán hờn.',
    practiceGuidance: 'Khởi tâm chúc bình an thầm lặng cho một người từng khiến bạn phiền lòng.',
  },
  {
    id: 26,
    verseNumber: 'Kệ số 204',
    chapter: 'Phẩm An Lạc (Sukha Vagga)',
    verse:
      'Không bệnh lợi tối thượng, biết đủ tài tối thượng, thành tín bạn tối thượng, Niết-bàn lạc tối thượng.',
    meaning:
      'Tài sản vô giá của một kiếp người là thân khỏe, tâm biết đủ, tình bạn chân thành và nội tâm giải thoát.',
    practiceGuidance: 'Viết ra 3 điều giản dị bạn đang biết ơn trong khoảnh khắc hiện tại.',
  },
  {
    id: 27,
    verseNumber: 'Kệ số 221',
    chapter: 'Phẩm Phẫn Nộ (Kodha Vagga)',
    verse:
      'Hãy bỏ tâm phẫn nộ, hãy trừ bỏ kiêu mạn, vượt qua mọi kiết sử, không chấp trước danh sắc, không vật, khổ không theo.',
    meaning:
      'Buông ngọn lửa giận hờn và cái tôi kiêu hãnh là trút bỏ gánh nặng ngàn cân trên đôi vai.',
    practiceGuidance: 'Hạ giọng nói và thả lỏng đôi vai khi cảm thấy căng thẳng.',
  },
  {
    id: 28,
    verseNumber: 'Kệ số 223',
    chapter: 'Phẩm Phẫn Nộ (Kodha Vagga)',
    verse:
      'Lấy không giận thắng giận, lấy thiện thắng không thiện, lấy thí thắng xan tham, lấy chân thắng hư ngụy.',
    meaning:
      'Sức mạnh mềm của từ bi, bố thí và sự chân thật luôn bền vững hơn mọi mưu tính nhất thời.',
    practiceGuidance: 'Thực hành cho đi một nụ cười, một sự lắng nghe hay một phần sẻ chia.',
  },
  {
    id: 29,
    verseNumber: 'Kệ số 227',
    chapter: 'Phẩm Phẫn Nộ (Kodha Vagga)',
    verse:
      'Từ xưa đã có vậy, chẳng phải chỉ ngày nay: Ngồi im cũng bị chê, nói nhiều cũng bị chê, nói vừa cũng bị chê. Đời không ai không bị chê.',
    meaning:
      'Đừng để dư luận bên ngoài làm lung lạc đạo tâm và lý tưởng thiện lương; ngay cả bậc Toàn Giác cũng từng bị đàm tiếu.',
    practiceGuidance: 'Giữ tâm thanh thản trước thị phi và chuyên tâm vào điều chân chính.',
  },
  {
    id: 30,
    verseNumber: 'Kệ số 246',
    chapter: 'Phẩm Cấu Uế (Mala Vagga)',
    verse:
      'Ai tại đời sát sanh, nói láo, lấy không cho, phạm đến vợ người khác, đam mê uống rượu men, người ấy tự đào bới gốc rễ ngay đời này.',
    meaning:
      'Giữ Ngũ Giới chính là hàng rào bảo hộ hạnh phúc gia đình, danh dự và sự bình an lâu dài của chính người cư sĩ.',
    practiceGuidance: 'Tự kiểm 5 giới thanh tịnh mỗi tối trước khi nghỉ ngơi.',
  },
  {
    id: 31,
    verseNumber: 'Kệ số 277',
    chapter: 'Phẩm Đạo (Magga Vagga)',
    verse:
      'Tất cả hành vô thường; với tuệ quán thấy vậy, đau khổ được nhàm chán; chính con đường thanh tịnh.',
    meaning:
      'Quán chiếu sự đổi thay không ngừng của vạn vật giúp ta bớt tham luyến và biết trân trọng từng phút giây hiện hữu.',
    practiceGuidance: 'Nhận diện tính vô thường của một phiền muộn đang có: rồi nó cũng sẽ qua.',
  },
  {
    id: 32,
    verseNumber: 'Kệ số 290',
    chapter: 'Phẩm Tạp Lục (Pakinnaka Vagga)',
    verse:
      'Nếu bỏ lạc nhỏ nhoi, thấy được lạc lớn hơn, bậc trí bỏ lạc nhỏ, hướng tâm đến lạc lớn.',
    meaning:
      'Học cách từ bỏ những thú vui ngắn ngủi gây mỏi mệt để nuôi dưỡng bình an sâu thẳm và sức khỏe bền lâu.',
    practiceGuidance: 'Tắt màn hình sớm hơn 30 phút tối nay để tụng kinh, đọc sách hoặc nghỉ ngơi.',
  },
  {
    id: 33,
    verseNumber: 'Kệ số 328',
    chapter: 'Phẩm Voi (Nāga Vagga)',
    verse:
      'Nếu được bạn hiền trí, đáng sống chung hạnh lành, bậc trí sống chánh niệm, hoan hỷ cùng đồng hành, nhiếp phục mọi hiểm nạn.',
    meaning:
      'Tình bạn đồng tu cùng chí hướng thiện lành nâng đỡ ta đi trọn vẹn qua mọi thử thách đường đời.',
    practiceGuidance: 'Gửi một lời nhắn động viên tốt đẹp đến bạn bè hoặc đạo hữu thân thiết.',
  },
  {
    id: 34,
    verseNumber: 'Kệ số 334',
    chapter: 'Phẩm Tham Ái (Tanhā Vagga)',
    verse:
      'Người sống đời phóng dật, ái tăng như dây leo. Chúng nhảy từ đời này, như vượn tìm trái cây.',
    meaning:
      'Chạy theo ham muốn không có điểm dừng khiến tâm mệt mỏi bất tận; biết đủ mới là cánh cửa giải thoát.',
    practiceGuidance: 'Thực hành trì chú hoặc hít thở sâu mỗi khi tâm muốn tiêu xài hay hưởng thụ bốc đồng.',
  },
  {
    id: 35,
    verseNumber: 'Kệ số 354',
    chapter: 'Phẩm Tham Ái (Tanhā Vagga)',
    verse:
      'Pháp thí thắng mọi thí, Pháp vị thắng mọi vị, Pháp hỷ thắng mọi hỷ, Ái diệt thắng mọi khổ.',
    meaning:
      'Món quà cao quý nhất trao cho người khác không chỉ là vật chất mà là một lời khuyên sáng suốt giúp họ vượt qua khổ đau.',
    practiceGuidance: 'Chia sẻ một bài kinh hay lời dạy ý nghĩa đến người đang cần sự bình an.',
  },
  {
    id: 36,
    verseNumber: 'Kệ số 387',
    chapter: 'Phẩm Bà La Môn (Brāhmana Vagga)',
    verse:
      'Mặt trời chiếu ban ngày, mặt trăng sáng ban đêm, giáp trụ sáng Sát-lỵ, thiền định sáng Phạm chí; còn Đức Phật chói sáng, suốt cả ngày lẫn đêm.',
    meaning:
      'Ánh sáng của từ bi và trí tuệ Phật Pháp soi rọi không gián đoạn, xua tan bóng tối si mê trong lòng mỗi người.',
    practiceGuidance: 'Hồi hướng toàn bộ công đức ngày hôm nay về miền an lạc cho muôn loài.',
  },
];

export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function getDailyDhammapadaVerse(date: Date = new Date()): DhammapadaVerse {
  const dayNum = getDayOfYear(date);
  return DHAMMAPADA_VERSES[dayNum % DHAMMAPADA_VERSES.length];
}

