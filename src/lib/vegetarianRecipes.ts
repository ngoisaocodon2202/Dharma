export interface VegetarianRecipe {
  id: string;
  name: string;
  category: 'kho' | 'canh' | 'xao' | 'tiec';
  cookTime: string;
  servings: string;
  difficulty: 'Dễ' | 'Trung bình';
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  healthBenefit: string;
}

export const VEGETARIAN_RECIPES: VegetarianRecipe[] = [
  {
    id: 'nam-kho-tieu',
    name: 'Nấm Đùi Gà Kho Tiêu Gừng',
    category: 'kho',
    cookTime: '25 phút',
    servings: '3-4 người',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Món kho đậm đà, vị cay ấm của tiêu và gừng hòa quyện với nấm dai ngọt tự nhiên, rất thích hợp cho những ngày mưa hoặc bữa cơm thanh đạm.',
    ingredients: [
      '300g nấm đùi gà (hoặc nấm rơm, nấm đông cô tươi)',
      '1 nhánh gừng tươi thái sợi',
      '2 muỗng canh nước tương ngon',
      '1 muỗng canh đường hoa mai hoặc đường phèn',
      '1 muỗng cà phê tiêu đen xay nhuyễn',
      'Hành boa-rô (tỏi tây) phi thơm',
      'Ớt tươi tỉa hoa',
    ],
    steps: [
      'Nấm rửa sạch bằng nước muối loãng, cắt miếng vừa ăn rồi ướp với nước tương, tiêu, đường và gừng trong 15 phút.',
      'Phi thơm hành boa-rô trong nồi đất, cho nấm vào đảo đều trên lửa lớn để săn mặt.',
      'Hạ lửa nhỏ, thêm nửa chén nước dừa tươi (hoặc nước ấm), kho liu riu đến khi nước sốt sánh lại áo quanh nấm.',
      'Rắc tiêu xay và ớt lên trên, dùng nóng với cơm gạo lứt hoặc cơm trắng thơm dẻo.',
    ],
    healthBenefit: 'Nấm giàu đạm thực vật, axit amin thiết yếu giúp bồi bổ cơ thể, tăng cường hệ miễn dịch mà không gây nặng bụng.',
  },
  {
    id: 'canh-sen-nam-duong-sinh',
    name: 'Canh Hạt Sen Nấm Tươi Dưỡng Sinh',
    category: 'canh',
    cookTime: '35 phút',
    servings: '4 người',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    description: 'Nước canh ngọt thanh tự nhiên từ củ sen, hạt sen Huế bùi bùi và nấm đông cô, giúp an thần dưỡng tâm và cải thiện giấc ngủ cho người lớn tuổi.',
    ingredients: [
      '150g hạt sen tươi (đã bỏ tâm sen)',
      '1 củ sen nhỏ thái khoanh mỏng',
      '1 củ cà rốt tỉa hoa',
      '100g nấm đông cô tươi hoặc nấm tuyết',
      'Ngò rí, tiêu, muối hồng Himalaya',
    ],
    steps: [
      'Củ sen và hạt sen rửa sạch, hầm trong nồi với 1 lít nước lọc cùng một chút muối trên lửa nhỏ 20 phút cho mềm bùi.',
      'Thêm cà rốt và nấm đông cô vào nấu tiếp khoảng 10 phút cho chín tới.',
      'Nêm muối hạt và chút hạt nêm nấm chay vừa khẩu vị thanh đạm.',
      'Múc canh ra tô, rắc ngò rí và tiêu thơm lên trên, thưởng thức khi còn ấm.',
    ],
    healthBenefit: 'Hạt sen và củ sen dưỡng tỳ, an thần, giúp giấc ngủ sâu và hỗ trợ điều hòa huyết áp rất tốt.',
  },
  {
    id: 'canh-chua-nam-bo-chay',
    name: 'Canh Chua Chay Nam Bộ',
    category: 'canh',
    cookTime: '20 phút',
    servings: '4 người',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&auto=format&fit=crop&q=80',
    description: 'Vị chua thanh mát từ me dốt, giòn ngọt từ dọc mùng, giá đỗ, dứa và đậu hũ non chiên vàng ươm.',
    ingredients: [
      '2 miếng đậu hũ non chiên vàng, thái khối',
      '1/4 quả dứa thơm chín ngọt',
      '1 cây dọc mùng (bạc hà) tước vỏ',
      '100g đậu bắp, giá đỗ',
      'Vắt me chua, rau ngổ, ngò gai thái nhỏ',
    ],
    steps: [
      'Dầm me với nước sôi lấy nước cốt chua.',
      'Phi thơm hành boa-rô, cho dứa và cà chua vào xào sơ lấy màu.',
      'Thêm nước lọc và nước cốt me vào đun sôi, cho đậu hũ và đậu bắp vào nấu 3 phút.',
      'Cuối cùng thêm dọc mùng và giá đỗ, tắt bếp ngay để giữ độ giòn. Rắc rau ngổ, ngò gai thơm lừng.',
    ],
    healthBenefit: 'Cung cấp nhiều chất xơ, vitamin C giúp thanh nhiệt giải độc và kích thích tiêu hóa nhẹ nhàng.',
  },
  {
    id: 'dau-hu-kho-thom',
    name: 'Đậu Hũ Non Kho Thơm (Dứa)',
    category: 'kho',
    cookTime: '20 phút',
    servings: '3 người',
    difficulty: 'Dễ',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Món ăn gia đình truyền thống, vị chua ngọt tự nhiên của dứa thấm đẫm vào từng thớ đậu hũ béo ngậy.',
    ingredients: [
      '3 miếng đậu hũ trắng chiên vàng',
      '1/2 quả dứa chín ngọt thái lát',
      'Nước tương, nước dừa tươi, tiêu',
      'Hành boa-rô băm nhỏ',
    ],
    steps: [
      'Chiên sơ dứa với chút đường cho xém cạnh thơm nức.',
      'Xếp đậu hũ và dứa vào nồi kho, thêm nước tương, nước dừa tươi vừa ngập.',
      'Kho lửa nhỏ trong 15 phút cho ngấm gia vị sánh sệt.',
      'Rắc hành boa-rô và tiêu, dùng nóng với cơm.',
    ],
    healthBenefit: 'Dứa giàu enzyme bromelain hỗ trợ tiêu hóa thức ăn, giảm viêm sưng khớp cho người trung niên.',
  },
];

