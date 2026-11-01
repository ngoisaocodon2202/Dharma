const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_DATABASE || 'phatphap',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
});

const booksData = [
  {
    id: '90000000-0000-0000-0000-000000000001',
    slug: 'kinh-phap-cu',
    title: 'Kinh Pháp Cú (Dhammapada)',
    subtitle: 'Tuyển tập 423 bài kệ vàng khai mở tuệ giác giải thoát',
    author: 'Đức Phật Thích Ca Mâu Ni',
    translator: 'HT. Thích Minh Châu dịch Việt',
    cover_image: '/images/books/kinh_phap_cu.jpg',
    description: 'Kinh Pháp Cú là một trong mười lăm quyển kinh thuộc Tiểu Bộ Kinh trong Kinh Tạng Pali. Tuyển tập 423 bài kệ ngắn gọn, súc tích chứa đựng cốt tủy giáo lý Phật đà, là cẩm nang tu dưỡng đạo đức cao quý của người con Phật qua mọi thời đại.',
    category: 'KINH_DIEN',
    total_pages: 260,
    published_year: 2020,
    chapters: [
      {
        title: 'Lời Tựa & Ý Nghĩa Kinh Pháp Cú',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Lời Tựa & Cốt Tủy Pháp Cú',
            title: 'Hương Thơm Của Giới Đức',
            content: `Kinh Pháp Cú (Dhammapada) là viên ngọc quý nhất trong kho tàng văn học Phật giáo Pali. Từng lời dạy của Đức Bổn Sư Thích Ca Mâu Ni được cô đọng thành những câu kệ ngũ ngôn dung dị mà thâm sâu mầu nhiệm.\n\nĐọc Kinh Pháp Cú không phải chỉ để tìm hiểu triết lý, mà là để soi rọi lại từng ý nghĩ, lời nói và hành vi của chính mình trong từng phút giây của đời sống thường nhật. Mỗi bài kệ như một giọt nước cam lộ tươi mát, gột rửa những trần cấu phiền não và đánh thức hạt giống tuệ giác vốn sẵn có trong tâm khảm mỗi người.`,
            quote: 'Hương các loài hoa thơm không ngược bay chiều gió. Chỉ hương người đức hạnh bay ngược gió bốn phương.',
            footnote: 'Dhammapada: Dhamma là Chân lý/Giáo pháp, Pada là Lời dạy/Con đường.'
          }
        ]
      },
      {
        title: 'Phẩm 1: Song Yếu (Yamakavagga)',
        startPage: 2,
        pages: [
          {
            pageNumber: 2,
            chapterTitle: 'Phẩm 1: Song Yếu (Yamakavagga)',
            title: 'Kệ 01 & 02: Tâm Là Chủ, Tâm Tạo Tác',
            content: `1. Ý dẫn đầu các pháp,\nÝ làm chủ, ý tạo;\nNếu với ý ô nhiễm,\nNói lên hay hành động,\nKhổ não bước theo sau,\nNhư xe chân vật kéo.\n\n2. Ý dẫn đầu các pháp,\nÝ làm chủ, ý tạo;\nNếu với ý thanh tịnh,\nNói lên hay hành động,\nAn lạc bước theo sau,\nNhư bóng không rời hình.\n\nÝ niệm là cội nguồn của mọi khổ vui nơi cõi nhân gian. Người biết hộ trì tâm ý như người lính canh giữ thành trì cẩn mật, chẳng để cho giặc phiền não lén lút xâm nhập.`,
            quote: 'Ý tịnh tạo an lạc, ý nhiễm chuốc khổ đau.',
            footnote: 'Phẩm Song Yếu gồm các cặp kệ đối lập: thiện và ác, khổ và vui.'
          },
          {
            pageNumber: 3,
            chapterTitle: 'Phẩm 1: Song Yếu (Yamakavagga)',
            title: 'Kệ 03 - 05: Hận Thù Diệt Hận Thù',
            content: `3. "Nó mắng tôi, đánh tôi,\nNó thắng tôi, cướp tôi",\nAi ôm ấp niệm ấy,\nHận thù không thể nguôi.\n\n4. "Nó mắng tôi, đánh tôi,\nNó thắng tôi, cướp tôi",\nKhông ôm ấp niệm ấy,\nHận thù tự nhiên nguôi.\n\n5. Ở đời này hận thù,\nKhông thể diệt hận thù;\nChỉ từ bi diệt hận,\nLà định luật ngàn thu.\n\nOán hận gặp oán hận chỉ tựa như lấy dầu đổ vào lửa cháy bùng thêm. Chỉ có lòng bao dung và ánh sáng của tình thương chân thật mới làm mát dịu những vết thương lòng muôn thuở.`,
            quote: 'Lấy ân báo oán, oán ấy tiêu tan. Lấy oán báo oán, oán hận chập chùng.',
            footnote: 'Đức Thế Tôn thuyết bài kệ này tại Kỳ Viên Tịnh Xá hóa giải thù hận muôn kiếp.'
          }
        ]
      },
      {
        title: 'Phẩm 2: Không Phóng Dật (Appamadavagga)',
        startPage: 4,
        pages: [
          {
            pageNumber: 4,
            chapterTitle: 'Phẩm 2: Không Phóng Dật (Appamadavagga)',
            title: 'Kệ 21 & 22: Con Đường Bất Tử',
            content: `21. Không phóng dật: đường sống,\nPhóng dật: đường của chết;\nNgười tinh tấn không chết,\nKẻ phóng dật như chết.\n\n22. Bậc trí tuệ thông suốt,\nĐiều bất tử cao thượng;\nVui trong không phóng dật,\nVui hạnh bậc Thánh hiền.\n\nPhóng dật là buông lung theo dục vọng, quên mất chánh niệm hiện tiền. Bậc trí giả luôn tỉnh thức, biết rõ từng hơi thở, từng bước chân, sống trọn vẹn trong tịnh thức không để tháng ngày trôi qua uổng phí.`,
            quote: 'Tinh tấn là sức mạnh nhiệm mầu phá tan ngàn trùng tăm tối.',
            footnote: 'Appamada: Sự không buông lung, tinh cần tỉnh giác trong từng sát-na.'
          },
          {
            pageNumber: 5,
            chapterTitle: 'Phẩm 2: Không Phóng Dật (Appamadavagga)',
            title: 'Kệ 25: Tự Xây Hòn Đảo Cho Chính Mình',
            content: `25. Bằng nỗ lực chuyên cần,\nBằng không phóng dật hạnh,\nBằng tự chế, tự điều,\nBậc trí xây hòn đảo,\nNước lũ không ngập tràn.\n\nGiữa đại dương cuồn cuộn của tham ái và sinh tử luân hồi, nếu không tự xây cho mình một hòn đảo của chánh niệm và giới đức, con người sẽ dễ dàng bị cuốn phăng vào vực thẳm mê lầm.\n\nHãy tự mình thắp đuốc lên mà đi, lấy Chánh pháp làm ngọn đèn chỉ lối, lấy Giới luật làm bậc thềm an ổn.`,
            quote: 'Hãy là ngọn đèn cho chính mình, hãy nương tựa nơi chính mình.',
            footnote: 'Lời di huấn thiêng liêng của Đức Thế Tôn trước giờ nhập Niết bàn.'
          }
        ]
      },
      {
        title: 'Phẩm 3: Tâm (Cittavagga)',
        startPage: 6,
        pages: [
          {
            pageNumber: 6,
            chapterTitle: 'Phẩm 3: Tâm (Cittavagga)',
            title: 'Kệ 33 - 35: Uốn Nắn Dòng Tâm Thức',
            content: `33. Tâm dao động, quay cuồng,\nKhó bảo hộ, khó nhiếp;\nNgười trí uốn thẳng tâm,\nNhư thợ tên uốn tên.\n\n34. Như cá quăng lên cạn,\nVẫy vùng trên đất khô;\nTâm này cũng vùng vẫy,\nĐể thoát vòng ma vương.\n\n35. Khó nắm giữ, khinh động,\nTheo các dục quay cuồng;\nLành thay, điều phục tâm!\nTâm điều, an lạc đến.\n\nTâm ý con người vốn vượn chuyền cành, ngựa phi đồng nội. Thiền định chính là nghệ thuật thuần hóa con tuấn mã ngỗ nghịch ấy trở về với chuồng thanh tịnh.`,
            quote: 'Thắng ngàn quân địch ngoài chiến trường không bằng tự thắng tâm mình.',
            footnote: 'Citta trong tiếng Pali chỉ tâm ý, dòng tư tưởng và tình cảm liên tục sinh diệt.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000002',
    slug: 'trai-tim-cua-but',
    title: 'Trái Tim Của Bụt',
    subtitle: 'Đi vào cội nguồn giáo lý đạo Bụt qua thiền quán chánh niệm',
    author: 'Thiền sư Thích Nhất Hạnh',
    translator: 'Nguyên tác tiếng Việt',
    cover_image: '/images/books/trai_tim_cua_but.jpg',
    description: 'Cuốn sách giới thiệu các giáo lý then chốt của đạo Phật qua lăng kính thiền quán và chánh niệm đầy chất thơ, sáng tỏ và gần gũi. Tác phẩm đi sâu vào Tứ Diệu Đế, Bát Chánh Đạo, Thập Nhị Nhân Duyên và Năm Uẩn dưới góc nhìn tươi mát, ứng dụng được ngay vào cuộc sống.',
    category: 'TRIET_HOC',
    total_pages: 380,
    published_year: 2018,
    chapters: [
      {
        title: 'Lời Mở Đầu: Tình Thương và Hiểu Biết',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Lời Mở Đầu',
            title: 'Đạo Bụt Của Tình Thương',
            content: `Bụt không phải là một vị thần linh ban phúc giáng họa. Bụt là một con người đã giác ngộ và chỉ cho chúng ta con đường để tự mình giác ngộ.\n\nGiáo lý của Bụt rất cụ thể và thực tế. Nó như dòng suối mát lành chảy qua sa mạc của những lo âu, bế tắc thời hiện đại. Khi ta biết dừng lại (Chỉ) và nhìn sâu (Quán), ta sẽ nhận ra rằng hạnh phúc chân thật luôn có mặt trong phút giây hiện tại, và chất liệu nuôi dưỡng tình thương chính là sự thấu hiểu sâu sắc nỗi khổ niềm đau của người khác.`,
            quote: 'Có hiểu mới có thương. Không hiểu biết thì không thể có tình thương chân thật.',
            footnote: 'Trích giảng thoại của Thiền sư Thích Nhất Hạnh tại Tu viện Làng Mai.'
          }
        ]
      },
      {
        title: 'Chương 1: Bốn Sự Thật Màu Nhiệm (Tứ Diệu Đế)',
        startPage: 2,
        pages: [
          {
            pageNumber: 2,
            chapterTitle: 'Chương 1: Bốn Sự Thật Màu Nhiệm',
            title: 'Khổ Đau Và Bông Sen',
            content: `Sự thật thứ nhất là Khổ (Dukkha). Cuộc đời có những nỗi đau: sinh, già, bệnh, chết, xa người thương, gần kẻ ghét, cầu không được.\n\nNhưng Bụt dạy về Khổ không phải để chúng ta bi quan chán đời, mà để chúng ta dám can đảm đối diện với sự thật. Khổ đau giống như bùn lầy dơ bẩn, còn hạnh phúc giải thoát giống như đóa hoa sen thanh khiết. Không có bùn thì không thể nào có sen. Người tu tập không chạy trốn khổ đau, mà học cách mỉm cười và chuyển hóa chất liệu bùn lầy thành hương hoa thơm ngát cho cuộc đời.`,
            quote: 'Không có bùn thì không có sen. Không có khổ đau thì không hiểu được hạnh phúc.',
            footnote: 'Bài học then chốt về tương tức (interbeing) giữa khổ đau và giải thoát.'
          },
          {
            pageNumber: 3,
            chapterTitle: 'Chương 1: Bốn Sự Thật Màu Nhiệm',
            title: 'Diệt Đế: Sự Vắng Mặt Của Lo Âu',
            content: `Sự thật thứ ba là Diệt (Nirodha) - sự chấm dứt của khổ đau, hay còn gọi là Niết bàn.\n\nNiết bàn không phải là một cõi xa xôi nào đó sau khi ta nhắm mắt lìa đời. Niết bàn là trạng thái mát mẻ, an tịnh ngay bây giờ và ở đây khi ngọn lửa tham lam, sân hận và si mê đã được dập tắt. Khi bạn thở một hơi thở nhẹ nhàng, buông hết gánh nặng ngàn cân trong lòng, giây phút ấy bạn đã chạm vào Niết bàn nhiệm mầu của Bụt.`,
            quote: 'Niết bàn không phải là điểm đến sau cái chết, Niết bàn là sự giải thoát ngay phút giây này.',
            footnote: 'Nirodha: sự dập tắt, vắng lặng phiền não.'
          }
        ]
      },
      {
        title: 'Chương 2: Con Đường Tám Nhánh (Bát Chánh Đạo)',
        startPage: 4,
        pages: [
          {
            pageNumber: 4,
            chapterTitle: 'Chương 2: Con Đường Tám Nhánh',
            title: 'Chánh Kiến: Đôi Mắt Tuệ Giác',
            content: `Chánh kiến (Samyak-drishti) là cái thấy đúng đắn, không bị thiên kiến, thành kiến hay sự phân biệt nhị nguyên che lấp.\n\nKhi nhìn một tờ giấy trắng, nếu có chánh kiến, ta sẽ thấy trong tờ giấy ấy có đám mây trôi (làm nên hạt mưa), có ánh nắng mặt trời (nuôi cây lớn), có người tiều phu đốn gỗ, và có cả hạt lúa người thợ ăn để làm ra giấy. Tờ giấy không thể tự mình tồn tại độc lập. Nó "tương tức" với tất cả vũ trụ vạn vật. Cái thấy tương tức ấy chính là đỉnh cao của Chánh kiến.`,
            quote: 'Bạn không hiện hữu một mình, bạn hiện hữu cùng với vạn vật (Inter-are).',
            footnote: 'Thuật ngữ "Tương tức" do Thiền sư sáng tạo để giải thích tính Không và Duyên khởi.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000003',
    slug: 'duong-xua-may-trang',
    title: 'Đường Xưa Mây Trắng',
    subtitle: 'Theo gót chân Bụt - thiên trường ca về cuộc đời Đức Thế Tôn',
    author: 'Thiền sư Thích Nhất Hạnh',
    translator: 'Nguyên tác tiếng Việt',
    cover_image: '/images/books/duong_xua_may_trang.jpg',
    description: 'Tác phẩm văn học Phật giáo kinh điển kể lại trọn vẹn cuộc đời Đức Phật Thích Ca Mâu Ni từ lúc đản sinh, xuất gia tầm đạo, thành đạo dưới cội bồ đề cho đến ngày nhập Niết bàn. Ngòi bút thi vị, êm ả như một bài thơ thiền dẫn dắt người đọc bước đi bên cạnh Đức Từ Phụ.',
    category: 'VANG_BONG',
    total_pages: 650,
    published_year: 2019,
    chapters: [
      {
        title: 'Chương 1: Chú Bé Chăn Trâu Svasti',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Chương 1: Chú Bé Chăn Trâu Svasti',
            title: 'Gặp Gỡ Bên Rừng Uruvela',
            content: `Svasti là một cậu bé chăn trâu nghèo khổ mười một tuổi ở làng Uruvela. Chiều hôm ấy, khi đang lùa đàn trâu về bãi cỏ quen thuộc ven sông Ni Liên Thiền, cậu bỗng bắt gặp một vị sa môn đang ngồi tĩnh lặng dưới bóng cây bồ đề râm mát.\n\nVị sa môn khoác chiếc y màu đất bạc màu, dáng ngồi trang nghiêm, thư thái tựa ngọn núi đá vững chãi. Đôi mắt Người toát lên một vẻ nhân từ ấm áp mà trước giờ Svasti chưa từng thấy nơi bất kỳ ai trên cõi đời này. Cậu bé rón rén bước lại gần, lòng ngập tràn kính phục và yêu thương lạ thường.`,
            quote: 'Bước chân của người giải thoát êm đềm như áng mây trắng thong dong giữa bầu trời xanh.',
            footnote: 'Svasti trong kinh văn tiếng Hán thường phiên âm là Cát Tường (Katthaka).'
          },
          {
            pageNumber: 2,
            chapterTitle: 'Chương 1: Chú Bé Chăn Trâu Svasti',
            title: 'Nắm Cỏ Kusa Dâng Lên Bụt',
            content: `Người mỉm cười nhìn Svasti, nụ cười làm tan biến mọi nỗi sợ hãi trong lòng cậu bé nghèo.\n\n- Em tên là gì?\n- Dạ thưa thầy, con tên là Svasti. Con cắt cỏ cho trâu ăn.\n\nNgười nhìn Svasti rồi nhìn bó cỏ xanh mướt trên tay cậu. Svasti chợt nhớ ra điều gì, vội kính cẩn dâng lên:\n- Thưa thầy, cỏ này thơm và sạch lắm. Thầy có muốn dùng làm tọa cụ để ngồi thiền không ạ?\n\nNgười mỉm cười đón nhận bó cỏ kusa từ tay Svasti, cảm ơn cậu với tất cả sự trân trọng chân thành của một bậc đại giác.`,
            quote: 'Một tấm lòng trong sáng dâng tặng một cọng cỏ cũng quý giá hơn ngàn cân vàng ngọc.',
            footnote: 'Bó cỏ kusa mà Svasti cúng dường trở thành bồ đoàn bất toạ dưới cội cây Bồ Đề.'
          }
        ]
      },
      {
        title: 'Chương 2: Đêm Thành Đạo',
        startPage: 3,
        pages: [
          {
            pageNumber: 3,
            chapterTitle: 'Chương 2: Đêm Thành Đạo',
            title: 'Sao Mai Mọc Dưới Cội Bồ Đề',
            content: `Đêm thứ bốn mươi chín, khi sao mai vừa mọc nơi chân trời phía đông, đại địa bỗng rúng động sáu cách. Sa môn Cù Đàm chứng đắc Vô Thượng Chánh Đẳng Chánh Giác.\n\nNgười thấy rõ nguồn gốc của sinh tử luân hồi, thấy rõ mọi chúng sanh đều có sẵn hạt giống giác ngộ sáng ngời nhưng vì màng nhện vô minh và tham ái che lấp nên phải chịu trôi lăn chìm nổi trong bể khổ trầm luân.\n\nNgười cất lên tiếng thở dài xót thương vô hạn: "Kỳ diệu thay! Tất cả chúng sanh đều đầy đủ đức tướng và trí tuệ của Như Lai!"`,
            quote: 'Mặt trời trí tuệ đã bừng nở, xua tan bóng đêm vô minh ngàn kiếp.',
            footnote: 'Sự kiện Đức Phật thành đạo vào ngày mùng 8 tháng 12 âm lịch.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000004',
    slug: 'tang-thu-song-chet',
    title: 'Tạng Thư Sống Chết',
    subtitle: 'Minh triết Tây Tạng về sinh tử và hành trình chuyển hóa tâm thức',
    author: 'Sogyal Rinpoche',
    translator: 'Ni sư Thích Nữ Trí Hải dịch',
    cover_image: '/images/books/tang_thu_song_chet.jpg',
    description: 'Cuốn sách tâm linh lừng danh thế giới dung hợp giáo lý Bardo Thodol huyền bí của Phật giáo Tây Tạng với cái nhìn khoa học, tâm lý học hiện đại. Tác phẩm hướng dẫn nghệ thuật sống an lạc, hiểu thấu quy luật vô thường và thanh thản bước qua cánh cửa tử sinh.',
    category: 'THIEN_HOC',
    total_pages: 520,
    published_year: 2017,
    chapters: [
      {
        title: 'Chương 1: Trong Tấm Gương Của Sự Chết',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Chương 1: Trong Tấm Gương Của Sự Chết',
            title: 'Nỗi Sợ Cái Chết Và Ảo Tưởng Bất Diệt',
            content: `Xã hội hiện đại dạy con người chuẩn bị cho mọi thứ: nghề nghiệp, tài chính, hôn nhân, tuổi già... nhưng lại hoàn toàn chối bỏ và sợ hãi cái chết.\n\nChúng ta sống như thể mình sẽ tồn tại vĩnh viễn trên cõi đời này, tích cóp tiền của, danh vọng rồi bất chợt bàng hoàng hoảng loạn khi thần chết gõ cửa. Nhìn thẳng vào cái chết không phải là bi quan, mà là cách duy nhất để ta thức tỉnh, trân quý từng hơi thở quý báu và sống một cuộc đời có ý nghĩa sâu sắc nhất.`,
            quote: 'Cái chết là tấm gương phản chiếu chân thật nhất giá trị của sự sống.',
            footnote: 'Bardo Thodol: Giải thoát qua sự lắng nghe trong cõi trung ấm.'
          },
          {
            pageNumber: 2,
            chapterTitle: 'Chương 1: Trong Tấm Gương Của Sự Chết',
            title: 'Bản Tự Nhiên Của Tâm (Rigpa)',
            content: `Tâm ta giống như bầu trời trong vắt, còn những ý nghĩ vui buồn, lo âu, giận dữ chỉ là những áng mây trôi dạt. Dù mây đen giông bão có mù mịt đến đâu, bản chất bầu trời vẫn luôn quang đãng, bao la và tĩnh lặng.\n\nThiền định không phải là xua đuổi mây đen, mà là nhận biết bản tính bầu trời xanh thẳm ấy. Khi ta an trú trong tự tính Rigpa sáng ngời, cái chết chỉ là sự tan biến của thân xác tứ đại, còn Phật tính thanh tịnh vẫn trường tồn bất hoại.`,
            quote: 'Nhận ra bản tâm là tìm thấy ngôi nhà bình yên tuyệt đối giữa giông bão thế gian.',
            footnote: 'Rigpa: Tuệ giác nguyên sơ, bản tính giác ngộ thanh tịnh thuần khiết.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000005',
    slug: 'kinh-kim-cuong',
    title: 'Kinh Kim Cương (Kim Cang Bát Nhã)',
    subtitle: 'Gươm báu cắt đứt phiền não và phá tan vô minh chấp thủ',
    author: 'Đức Phật Thích Ca Mâu Ni',
    translator: 'Thiền sư Thích Nhất Hạnh bình giải',
    cover_image: '/images/books/kinh_kim_cuong.jpg',
    description: 'Bộ kinh cốt tủy của hệ thống Bát Nhã Ba La Mật Đa. Kinh dạy về tinh thần vô trụ, vô tướng, vô cầu: làm tất cả việc lành, độ khắp chúng sanh mà không thấy mình là người làm, không thấy việc được làm, tâm không hề dính mắc.',
    category: 'KINH_DIEN',
    total_pages: 280,
    published_year: 2021,
    chapters: [
      {
        title: 'Phẩm 1: Pháp Hội Nhân Duyên Khởi',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Phẩm 1: Pháp Hội Nhân Duyên Khởi',
            title: 'Bữa Cơm Khất Thực Của Bụt',
            content: `Một thời Bụt ở nước Xá-vệ, tại rừng Kỳ-đà, vườn Cấp Cô Độc, cùng với chúng đại tỳ-kheo một ngàn hai trăm năm mươi người.\n\nĐến giờ thọ trai, Bụt đắp y, mang bát vào thành lớn Xá-vệ khất thực. Theo thứ tự từng nhà khất thực xong, Người trở về tịnh xá, dùng cơm, cất y bát, rửa chân, trải tòa mà ngồi.\n\nToàn bộ tinh hoa của Kinh Kim Cương bắt đầu từ những cử chỉ bình dị nhất: đắp y, ôm bát, đi từng bước, rửa chân. Chân lý tối thượng không nằm ở ngôn từ hoa mỹ, mà ngự trị ngay trong sự tĩnh lặng của nếp sống giải thoát thường ngày.`,
            quote: 'Đạo pháp hiện tiền nơi từng bước chân khất thực thanh tịnh.',
            footnote: 'Vajracchedika Prajnaparamita Sutra - Kim Cương Bát Nhã Ba La Mật Kinh.'
          }
        ]
      },
      {
        title: 'Phẩm 3: Đại Thừa Chánh Tông',
        startPage: 2,
        pages: [
          {
            pageNumber: 2,
            chapterTitle: 'Phẩm 3: Đại Thừa Chánh Tông',
            title: 'Độ Tận Chúng Sanh Mà Không Thấy Có Chúng Sanh Được Độ',
            content: `Bụt bảo Tu-bồ-đề:\n"Bồ-tát ma-ha-tát nên hàng phục tâm mình như vầy: Hết thảy các loài chúng sanh, noãn sinh, thai sinh, thấp sinh, hóa sinh... Ta đều đưa vào cõi Vô Dư Niết Bàn khiến họ được giải thoát. Độ vô lượng vô biên chúng sanh như thế, mà thực ra không có chúng sanh nào được diệt độ.\n\nVì cớ sao? Này Tu-bồ-đề! Nếu Bồ-tát còn có tướng Ngã, tướng Nhân, tướng Chúng Sanh, tướng Thọ Giả, thời chẳng phải là Bồ-tát."`,
            quote: 'Ưng vô sở trụ, nhi sinh kỳ tâm. (Đừng trụ vào đâu mà phát khởi tâm thanh tịnh).',
            footnote: 'Bốn tướng cơ bản của sự chấp ngã: Ngã, Nhân, Chúng sanh, Thọ giả.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000006',
    slug: 'hanh-phuc-cam-tay',
    title: 'Hạnh Phúc Cầm Tay',
    subtitle: 'Cẩm nang nuôi dưỡng bình an và mỉm cười trong từng giây phút hiện tại',
    author: 'Thiền sư Thích Nhất Hạnh',
    translator: 'Nguyên tác tiếng Việt',
    cover_image: '/images/books/hanh_phuc_cam_tay.jpg',
    description: 'Cuốn sách chắt lọc những hướng dẫn thực tập chánh niệm ngắn gọn, giản dị mà mầu nhiệm: cách thở, cách mỉm cười, cách ăn cơm, rửa bát, uống trà, cách buông bỏ muộn phiền để cảm nhận hạnh phúc đang có sẵn ngay trong lòng bàn tay.',
    category: 'THIEN_HOC',
    total_pages: 220,
    published_year: 2021,
    chapters: [
      {
        title: 'Thực Tập 1: Hơi Thở Ý Thức',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Thực Tập 1: Hơi Thở Ý Thức',
            title: 'Thở Vào Tâm Tĩnh Lặng',
            content: `Thở vào, tôi biết tôi đang thở vào.\nThở ra, tôi biết tôi đang thở ra.\n\nChỉ một hơi thở ý thức như thế thôi cũng đủ để đưa tâm bạn quay trở về với thân thể trong giây phút hiện tại. Khi tâm và thân hợp nhất, bạn mới thực sự có mặt, thực sự sống. Bạn sẽ nhận ra bầu trời vẫn xanh, mây vẫn trắng, chim vẫn hót, và trái tim bạn vẫn đang đập nhịp đập yêu thương mầu nhiệm.`,
            quote: 'Hạnh phúc không phải là chuyện tương lai. Hạnh phúc là nghệ thuật sống trong hiện tại.',
            footnote: 'Phép quán niệm hơi thở theo Kinh Anapanasati.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000007',
    slug: 'muon-kiep-nhan-sinh',
    title: 'Muôn Kiếp Nhân Sinh',
    subtitle: 'Bức tranh toàn cảnh về nhân quả, luân hồi và thức tỉnh tâm linh',
    author: 'Nguyên Phong',
    translator: 'Phóng tác và ghi chép',
    cover_image: '/images/books/muon_kiep_nhan_sinh.jpg',
    description: 'Tác phẩm gây chấn động độc giả về hành trình luân hồi qua nhiều kiếp sống của doanh nhân Thomas tại Atlantis, Ai Cập cổ đại và Hy Lạp. Cuốn sách gióng lên hồi chuông cảnh tỉnh về định luật nhân quả khắt khe và tầm quan trọng của việc gieo rắc tình thương, nâng cao rung động tâm thức.',
    category: 'NHAN_QUA',
    total_pages: 420,
    published_year: 2020,
    chapters: [
      {
        title: 'Chương 1: Nhân Duyên Kỳ Lạ Tại Đài Bắc',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Chương 1: Nhân Duyên Kỳ Lạ',
            title: 'Hạt Mầm Luân Hồi',
            content: `Cuộc gặp gỡ tình cờ giữa tác giả và doanh nhân tài chính phố Wall Thomas tại một tu viện tĩnh mịch ở Đài Loan đã mở ra câu chuyện phi thường về ký ức muôn kiếp nhân sinh.\n\nThomas tâm sự: "Trước đây tôi chỉ tin vào tiền bạc, logic và những con số khô khan. Cho đến khi những ký ức tiền kiếp ùa về, tôi mới hiểu rằng vũ trụ này vận hành bởi một luật lệ tuyệt đối chính xác: Luật Nhân Quả. Mọi ý nghĩ, lời nói, hành động của ta như những hạt giống gieo vào không gian, sớm muộn gì cũng trổ quả mà chính ta phải gánh chịu."`,
            quote: 'Nhân quả đừng đợi kiếp sau mới thấy. Từng hành động nhỏ hôm nay đang dệt nên số phận ngày mai.',
            footnote: 'Tác phẩm được First News phát hành và trở thành hiện tượng văn hóa đọc.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000008',
    slug: 'an-lac-tung-buoc-chan',
    title: 'An Lạc Từng Bước Chân',
    subtitle: 'Con đường chuyển hóa khổ đau tìm về an nhiên tự tại',
    author: 'Thiền sư Thích Nhất Hạnh',
    translator: 'Chân Pháp Khâm dịch',
    cover_image: '/images/books/an_lac_tung_buoc_chan.jpg',
    description: 'Bản hướng dẫn tuyệt đẹp về thiền hành và nghệ thuật an trú trong hiện tại. Từng bước chân đặt trên mặt đất là một lời cầu nguyện cho hòa bình thế giới, nhắc nhở ta rằng sự an lạc đích thực bắt đầu từ một tâm hồn bình yên.',
    category: 'THIEN_HOC',
    total_pages: 240,
    published_year: 2020,
    chapters: [
      {
        title: 'Phần 1: Nụ Cười Của Hiện Tại',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Phần 1: Nụ Cười Của Hiện Tại',
            title: 'Đi Như Một Người Tự Do',
            content: `Khi bạn đi, hãy đặt bàn chân xuống đất với tất cả sự nâng niu, dịu dàng như đang hôn lên mặt đất mẹ.\n\nĐừng đi như bị ma đuổi, đừng mang theo những toan tính dự án vào từng bước chân. Hãy bước đi như một người hoàn toàn tự do, thong dong giữa cuộc đời. Trái đất này là tịnh độ, và mỗi bước chân an lạc là một bông hoa sen nở dưới gót hài của bạn.`,
            quote: 'Không có con đường đi đến hòa bình, hòa bình chính là con đường.',
            footnote: 'Thiền hành (Kinh hành) là pháp môn đặc trưng của truyền thống Làng Mai.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000009',
    slug: 'phat-hoc-pho-thong',
    title: 'Phật Học Phổ Thông',
    subtitle: 'Bộ giáo trình Phật học căn bản và nền tảng cho người sơ cơ đến chuyên tu',
    author: 'Hòa thượng Thích Thiện Hoa',
    translator: 'Nguyên bản tiếng Việt',
    cover_image: '/images/books/phat_hoc_pho_thong.jpg',
    description: 'Bộ sách giáo khoa Phật học kinh điển gồm 12 khóa học do cố Hòa thượng Thích Thiện Hoa biên soạn. Hệ thống hóa toàn bộ giáo lý Phật đà từ Tam quy, Ngũ giới, Thập thiện, Bát Chánh Đạo đến các triết thuyết Đại thừa cao sâu như Duy Thức, Bát Nhã, Hoa Nghiêm.',
    category: 'GIAO_LY',
    total_pages: 980,
    published_year: 2019,
    chapters: [
      {
        title: 'Khóa I: Bài 1 - Mười Lợi Ích Của Việc Học Phật',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Khóa I: Bài 1',
            title: 'Ánh Sáng Khai Mở Trí Tuệ',
            content: `Đạo Phật là đạo giác ngộ, không phải là mê tín van xin. Người học Phật trước hết phải dùng chánh kiến để nhận định chân lý, phân biệt chánh tà.\n\nMười điều lợi ích tối thượng khi học Phật:\n1. Phá tan bóng đêm vô minh si ám.\n2. Dứt trừ lo âu phiền muộn trong lòng.\n3. Xây dựng đời sống đạo đức mẫu mực.\n4. Hiểu rõ quy luật nhân quả, không làm điều xằng bậy.\n5. Tự làm chủ tâm hồn, không bị hoàn cảnh lay chuyển.\n6. Mở rộng lòng từ bi yêu thương muôn loài.\n7. Xây dựng gia đình êm ấm, xã hội hòa bình.\n8. Giải thoát khỏi cạm bẫy danh lợi hão huyền.\n9. Thắp sáng hạt giống giác ngộ vô thượng.\n10. Đạt đến an lạc giải thoát rốt ráo Niết bàn.`,
            quote: 'Học Phật là để mở mang trí tuệ và nuôi lớn lòng từ bi, chẳng phải để cầu xin danh lợi.',
            footnote: 'Hòa thượng Thích Thiện Hoa (1918 - 1973), viện trưởng Viện Hóa Đạo GHPGVNTN.'
          }
        ]
      }
    ]
  },
  {
    id: '90000000-0000-0000-0000-000000000010',
    slug: 'kinh-dia-tang',
    title: 'Kinh Địa Tạng Bồ Tát Bổn Nguyện',
    subtitle: 'Nguyện lực bao la cứu vớt chúng sanh cõi u minh tăm tối',
    author: 'Đức Phật Thích Ca Mâu Ni',
    translator: 'HT. Thích Trí Tịnh dịch Việt',
    cover_image: '/images/books/kinh_dia_tang.jpg',
    description: 'Bộ kinh hiếu đạo bậc nhất của Phật giáo Đại thừa. Kể lại tiền thân chí hiếu của Bồ Tát Địa Tạng cứu mẹ khỏi địa ngục và phát đại nguyện: "Địa ngục vị không, thệ bất thành Phật; Chúng sanh độ tận, phương chứng Bồ đề".',
    category: 'KINH_DIEN',
    total_pages: 360,
    published_year: 2021,
    chapters: [
      {
        title: 'Phẩm 1: Thần Thông Tại Cung Trời Đao Lợi',
        startPage: 1,
        pages: [
          {
            pageNumber: 1,
            chapterTitle: 'Phẩm 1: Cung Trời Đao Lợi',
            title: 'Đức Bụt Tán Thán Đại Nguyện Địa Tạng',
            content: `Như vầy tôi nghe. Một thời Đức Bụt ở tại cung trời Đao Lợi vì Thánh Mẫu Ma-da mà thuyết pháp.\n\nLúc bấy giờ, Bồ Tát Địa Tạng nương thần lực của Bụt mà hiện phân thân khắp trăm ngàn muôn ức thế giới, đến trước Đức Thế Tôn. Đức Bụt đưa bàn tay sắc vàng xoa đảnh Bồ Tát Địa Tạng mà phó chúc:\n\n"Này Địa Tạng! Từ nay cho đến khi Phật Di Lặc ra đời, chúng sanh trong cõi Ta bà này can cường khó độ, Ta giao phó cho ông. Đừng để cho một chúng sanh nào bị đọa vào địa ngục chịu khổ dù chỉ một ngày một đêm!"`,
            quote: 'Địa ngục chưa trống, thề chưa thành Phật. Chúng sanh độ hết, mới chứng Bồ đề.',
            footnote: 'Kinh Địa Tạng được xem là Hiếu Kinh của đạo Phật phương Đông.'
          }
        ]
      }
    ]
  }
];

async function seed() {
  console.log('Seeding rich books into PostgreSQL...');
  for (const b of booksData) {
    const queryStr = `
      INSERT INTO books (id, slug, title, subtitle, author, translator, cover_image, description, category, total_pages, published_year, chapters, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        author = EXCLUDED.author,
        translator = EXCLUDED.translator,
        cover_image = EXCLUDED.cover_image,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        total_pages = EXCLUDED.total_pages,
        published_year = EXCLUDED.published_year,
        chapters = EXCLUDED.chapters;
    `;
    await pool.query(queryStr, [
      b.id,
      b.slug,
      b.title,
      b.subtitle,
      b.author,
      b.translator,
      b.cover_image,
      b.description,
      b.category,
      b.total_pages,
      b.published_year,
      JSON.stringify(b.chapters)
    ]);
    console.log(`✓ Seeded book: ${b.title} (${b.slug})`);
  }
  console.log('Finished seeding 10 rich books successfully!');
  await pool.end();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
