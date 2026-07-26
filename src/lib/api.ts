// lib/api.ts
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ============================================================
// 🔧 MOCK MODE — set false khi kết nối backend thật
// ============================================================
const MOCK_ENABLED = true;

// ✅ Đặt baseURL mặc định trỏ đến API thật trên Azure
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://memoirsvietnam-faa3hydzbwhbdnhe.southeastasia-01.azurewebsites.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: chỉ chạy trong môi trường trình duyệt (client-side)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// 📦 MOCK DATA
// ============================================================
if (MOCK_ENABLED) {

  // --- IDs ---
  const eraIds = [
    "e1a00000-0000-0000-0000-000000000001",
    "e1a00000-0000-0000-0000-000000000002",
    "e1a00000-0000-0000-0000-000000000003",
  ];
  const articleIds = [
    "a1a00000-0000-0000-0000-000000000001",
    "a1a00000-0000-0000-0000-000000000002",
    "a1a00000-0000-0000-0000-000000000003",
  ];
  const podcastIds = [
    "p1a00000-0000-0000-0000-000000000001",
    "p1a00000-0000-0000-0000-000000000002",
  ];
  const productIds = [
    "d1a00000-0000-0000-0000-000000000001",
    "d1a00000-0000-0000-0000-000000000002",
    "d1a00000-0000-0000-0000-000000000003",
    "d1a00000-0000-0000-0000-000000000004",
    "d1a00000-0000-0000-0000-000000000005",
    "d1a00000-0000-0000-0000-000000000006",
  ];
  const categoryIds = [
    "c1a00000-0000-0000-0000-000000000001",
    "c1a00000-0000-0000-0000-000000000002",
    "c1a00000-0000-0000-0000-000000000003",
  ];
  const userIds = [
    "u1a00000-0000-0000-0000-000000000001",
    "u1a00000-0000-0000-0000-000000000002",
    "u1a00000-0000-0000-0000-000000000003",
  ];
  const orderIds = [
    "o1a00000-0000-0000-0000-000000000001",
    "o1a00000-0000-0000-0000-000000000002",
    "o1a00000-0000-0000-0000-000000000003",
    "o1a00000-0000-0000-0000-000000000004",
    "o1a00000-0000-0000-0000-000000000005",
  ];

  // --- Eras ---
  const eras = [
    {
      id: eraIds[0],
      name: "Thời kỳ Hùng Vương",
      yearStart: -2879,
      yearEnd: -258,
      description:
        "Thời kỳ dựng nước đầu tiên của dân tộc Việt Nam với 18 đời vua Hùng, gắn liền với truyền thuyết Lạc Long Quân – Âu Cơ và nền văn minh lúa nước rực rỡ tại đồng bằng sông Hồng.",
    },
    {
      id: eraIds[1],
      name: "Thời kỳ Bắc thuộc và Đấu tranh giành độc lập",
      yearStart: -111,
      yearEnd: 938,
      description:
        "Hơn một ngàn năm Bắc thuộc với nhiều cuộc khởi nghĩa vĩ đại: Hai Bà Trưng (40), Bà Triệu (248), Lý Bí (544), Mai Thúc Loan (722), Phùng Hưng (791) và chiến thắng Bạch Đằng lịch sử (938) của Ngô Quyền.",
    },
    {
      id: eraIds[2],
      name: "Triều Nguyễn",
      yearStart: 1802,
      yearEnd: 1945,
      description:
        "Triều đại phong kiến cuối cùng của Việt Nam, với kinh đô Huế, Đại Nội, lăng tẩm và hệ thống cung điện nguy nga. Đây cũng là thời kỳ chịu ảnh hưởng của Pháp và chuyển mình sang thời hiện đại.",
    },
  ];

  // --- Articles ---
  const articles = [
    {
      id: articleIds[0],
      title: "Đền Hùng và nguồn gốc dân tộc Việt",
      slug: "den-hung-va-nguon-goc-dan-toc-viet",
      content:
        "Đền Hùng là quần thể di tích lịch sử nằm trên núi Nghĩa Lĩnh, thành phố Việt Trì, tỉnh Phú Thọ, là nơi thờ cúng các vua Hùng — những vị vua đầu tiên của nước Văn Lang. Theo truyền thuyết, Lạc Long Quân và Âu Cơ sinh ra bọc trăm trứng, nở ra trăm người con, chia nhau lên rừng xuống biển, khai phá đất nước. Ngày Giỗ Tổ Hùng Vương (10/3 âm lịch) đã trở thành ngày quốc lễ, nhắc nhở con cháu về cội nguồn dân tộc. Nền văn minh lúa nước, trống đồng Đông Sơn và hệ thống tín ngưỡng thờ cúng tổ tiên bắt nguồn từ thời kỳ này. Đền Hùng không chỉ là di tích lịch sử mà còn là biểu tượng thiêng liêng của tinh thần đoàn kết dân tộc Việt Nam.",
      coverUrl:
        "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80",
      yearStart: -2879,
      yearEnd: -258,
      eraId: eraIds[0],
      era: eras[0],
      sources: [
        { title: "Wikipedia - Hùng Vương", url: "https://vi.wikipedia.org/wiki/H%C3%B9ng_V%C6%B0%C6%A1ng" },
        { title: "Bảo tàng Lịch sử Quốc gia", url: "https://baotanglichsu.vn" },
      ],
      publishedAt: "2025-03-10T08:00:00Z",
      createdAt: "2025-03-01T08:00:00Z",
    },
    {
      id: articleIds[1],
      title: "Trận Bạch Đằng 938 — Bản hùng ca giành độc lập",
      slug: "tran-bach-dang-938",
      content:
        "Trận Bạch Đằng năm 938 là trận chiến quyết định trên sông Bạch Đằng giữa quân Nam Hán do Lưu Hoằng Tháo chỉ huy và quân ta dưới sự lãnh đạo của Ngô Quyền. Bằng kế cắm cọc gỗ bọc sắt dưới lòng sông, Ngô Quyền đã tận dụng thủy triều để đánh tan đội thuyền chiến của Nam Hán. Chiến thắng Bạch Đằng chấm dứt hơn một ngàn năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ lâu dài cho dân tộc Việt Nam. Ngô Quyền lên ngôi vua, đóng đô ở Cổ Loa, đặt nền móng cho các triều đại Đinh, Tiền Lê, Lý, Trần rực rỡ sau này.",
      coverUrl:
        "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&q=80",
      yearStart: 938,
      yearEnd: 938,
      eraId: eraIds[1],
      era: eras[1],
      sources: [
        { title: "Lịch sử Việt Nam", url: "https://vi.wikipedia.org/wiki/Tr%E1%BA%ADn_B%E1%BA%A1ch_%C4%90%E1%BA%B1ng_(938)" },
      ],
      publishedAt: "2025-04-15T10:00:00Z",
      createdAt: "2025-04-10T10:00:00Z",
    },
    {
      id: articleIds[2],
      title: "Triều Nguyễn và Di sản Cố đô Huế",
      slug: "trieu-nguyen-va-di-san-co-do-hue",
      content:
        "Triều Nguyễn (1802-1945) là triều đại phong kiến cuối cùng trong lịch sử Việt Nam, do vua Gia Long sáng lập sau khi thống nhất đất nước. Với kinh đô đặt tại Huế, triều Nguyễn để lại quần thể di tích Cố đô Huế — Di sản Văn hóa Thế giới UNESCO. Đại Nội Huế với Ngọ Môn, điện Thái Hòa, Tử Cấm Thành cùng hệ thống lăng tẩm của các vua Minh Mạng, Tự Đức, Khải Định thể hiện đỉnh cao của kiến trúc cung đình Việt Nam. Nhã nhạc cung đình Huế — di sản phi vật thể thế giới — vẫn còn vang vọng đến ngày nay, minh chứng cho nền văn hóa tinh hoa của dân tộc.",
      coverUrl:
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80",
      yearStart: 1802,
      yearEnd: 1945,
      eraId: eraIds[2],
      era: eras[2],
      sources: [
        { title: "UNESCO - Complex of Hué Monuments", url: "https://whc.unesco.org/en/list/678" },
        { title: "Wikipedia - Nhà Nguyễn", url: "https://vi.wikipedia.org/wiki/Nh%C3%A0_Nguy%E1%BB%85n" },
      ],
      publishedAt: "2025-05-20T14:00:00Z",
      createdAt: "2025-05-15T14:00:00Z",
    },
  ];

  // --- Categories ---
  const categories = [
    { id: categoryIds[0], name: "Sách lịch sử" },
    { id: categoryIds[1], name: "Tranh & Nghệ thuật" },
    { id: categoryIds[2], name: "Quà lưu niệm" },
  ];

  // --- Products ---
  const products = [
    {
      id: productIds[0],
      name: "Việt Nam Sử Lược - Trần Trọng Kim",
      slug: "viet-nam-su-luoc",
      description:
        "Bộ sách lịch sử kinh điển của tác giả Trần Trọng Kim, trình bày toàn bộ lịch sử Việt Nam từ thời Hồng Bàng đến cuối triều Nguyễn. Ấn bản bìa cứng cao cấp, giấy in chất lượng cao.",
      price: 285000,
      stock: 50,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80",
      ]),
      categoryId: categoryIds[0],
      category: categories[0],
    },
    {
      id: productIds[1],
      name: "Đại Việt Sử Ký Toàn Thư",
      slug: "dai-viet-su-ky-toan-thu",
      description:
        "Bộ quốc sử lớn nhất của Việt Nam thời phong kiến, ghi chép lịch sử từ thời Hồng Bàng đến đời vua Lê Thái Tổ. Bản dịch hiện đại, chú giải đầy đủ.",
      price: 450000,
      stock: 30,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
      ]),
      categoryId: categoryIds[0],
      category: categories[0],
    },
    {
      id: productIds[2],
      name: "Tranh Đông Hồ - Đám cưới chuột",
      slug: "tranh-dong-ho-dam-cuoi-chuot",
      description:
        "Tranh dân gian Đông Hồ chủ đề 'Đám cưới chuột' — tác phẩm nghệ thuật truyền thống phản ánh đời sống xã hội Việt Nam xưa. In trên giấy dó thủ công.",
      price: 180000,
      stock: 25,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
      ]),
      categoryId: categoryIds[1],
      category: categories[1],
    },
    {
      id: productIds[3],
      name: "Mô hình Khuê Văn Các",
      slug: "mo-hinh-khue-van-cac",
      description:
        "Mô hình Khuê Văn Các — biểu tượng của Hà Nội và Văn Miếu Quốc Tử Giám. Chất liệu gỗ mun cao cấp, chế tác thủ công tinh xảo, phù hợp làm quà tặng hoặc trang trí.",
      price: 520000,
      stock: 15,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
      ]),
      categoryId: categoryIds[2],
      category: categories[2],
    },
    {
      id: productIds[4],
      name: "Áo dài truyền thống",
      slug: "ao-dai-truyen-thong",
      description:
        "Áo dài lụa tơ tằm truyền thống Việt Nam, thiết kế cổ điển với họa tiết hoa sen thêu tay. Phù hợp cho các dịp lễ hội, sự kiện văn hóa.",
      price: 1200000,
      stock: 10,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80",
      ]),
      categoryId: categoryIds[2],
      category: categories[2],
    },
    {
      id: productIds[5],
      name: "Bản đồ Đại Việt cổ",
      slug: "ban-do-dai-viet-co",
      description:
        "Bản sao bản đồ Đại Việt thời Hồng Đức (1490), in trên giấy dó cao cấp, khung gỗ sồi. Kích thước 60x80cm, phù hợp treo tường trang trí.",
      price: 350000,
      stock: 20,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80",
      ]),
      categoryId: categoryIds[1],
      category: categories[1],
    },
  ];

  // --- Podcasts ---
  const podcasts = [
    {
      id: podcastIds[0],
      title: "Lịch sử Việt Nam qua các thời kỳ",
      description:
        "Podcast kể chuyện lịch sử Việt Nam từ thời dựng nước đến hiện đại, với góc nhìn mới mẻ và sinh động dành cho thế hệ trẻ.",
      coverUrl:
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80",
      createdAt: "2025-01-15T08:00:00Z",
      episodes: [
        {
          id: "ep100000-0000-0000-0000-000000000001",
          podcastId: podcastIds[0],
          title: "Tập 1: Huyền thoại Lạc Long Quân và Âu Cơ",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          duration: 1845,
          episodeNumber: 1,
          isDeleted: false,
        },
        {
          id: "ep100000-0000-0000-0000-000000000002",
          podcastId: podcastIds[0],
          title: "Tập 2: Thời kỳ Bắc thuộc và các cuộc khởi nghĩa",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          duration: 2230,
          episodeNumber: 2,
          isDeleted: false,
        },
        {
          id: "ep100000-0000-0000-0000-000000000003",
          podcastId: podcastIds[0],
          title: "Tập 3: Chiến thắng Bạch Đằng — Bước ngoặt lịch sử",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
          duration: 1920,
          episodeNumber: 3,
          isDeleted: false,
        },
      ],
    },
    {
      id: podcastIds[1],
      title: "Câu chuyện di sản Việt",
      description:
        "Khám phá các di sản văn hóa vật thể và phi vật thể UNESCO tại Việt Nam — từ Cố đô Huế đến Nhã nhạc cung đình.",
      coverUrl:
        "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80",
      createdAt: "2025-02-20T10:00:00Z",
      episodes: [
        {
          id: "ep200000-0000-0000-0000-000000000001",
          podcastId: podcastIds[1],
          title: "Tập 1: Cố đô Huế — Vẻ đẹp trường tồn",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
          duration: 2100,
          episodeNumber: 1,
          isDeleted: false,
        },
        {
          id: "ep200000-0000-0000-0000-000000000002",
          podcastId: podcastIds[1],
          title: "Tập 2: Phố cổ Hội An — Giao thoa văn hóa",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          duration: 1800,
          episodeNumber: 2,
          isDeleted: false,
        },
      ],
    },
  ];

  // --- Users ---
  const users = [
    {
      id: userIds[0],
      name: "Nguyễn Văn An",
      phone: "0901234567",
      address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
      email: "nguyenvanan@gmail.com",
      verifiedAt: "2025-01-10T00:00:00Z",
      createdAt: "2025-01-05T00:00:00Z",
      updatedAt: "2025-06-01T00:00:00Z",
      loginId: "l1a00000-0000-0000-0000-000000000001",
      login: {
        id: "l1a00000-0000-0000-0000-000000000001",
        email: "nguyenvanan@gmail.com",
        role: "User" as const,
        createdAt: "2025-01-05T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      },
    },
    {
      id: userIds[1],
      name: "Trần Thị Bích",
      phone: "0912345678",
      address: "456 Lê Lợi, Quận 3, TP. Hồ Chí Minh",
      email: "tranthibich@gmail.com",
      verifiedAt: "2025-02-15T00:00:00Z",
      createdAt: "2025-02-10T00:00:00Z",
      updatedAt: "2025-06-01T00:00:00Z",
      loginId: "l1a00000-0000-0000-0000-000000000002",
      login: {
        id: "l1a00000-0000-0000-0000-000000000002",
        email: "tranthibich@gmail.com",
        role: "User" as const,
        createdAt: "2025-02-10T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      },
    },
    {
      id: userIds[2],
      name: "Admin MemoriesVN",
      phone: "0900000000",
      address: "Văn phòng Memoirs Vietnam, Hà Nội",
      email: "admin@memoriesvietnam.com",
      verifiedAt: "2025-01-01T00:00:00Z",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-06-01T00:00:00Z",
      loginId: "l1a00000-0000-0000-0000-000000000003",
      login: {
        id: "l1a00000-0000-0000-0000-000000000003",
        email: "admin@memoriesvietnam.com",
        role: "Admin" as const,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      },
    },
  ];

  // --- Orders ---
  const orders = [
    {
      id: orderIds[0],
      userId: userIds[0],
      total: 735000,
      payment: "VNPAY",
      createdAt: "2025-07-20T09:30:00Z",
      status: 0,
      user: users[0],
      orderItems: [
        {
          id: "oi100000-0000-0000-0000-000000000001",
          orderId: orderIds[0],
          productId: productIds[0],
          qty: 1,
          price: 285000,
          product: { id: productIds[0], name: "Việt Nam Sử Lược - Trần Trọng Kim", slug: "viet-nam-su-luoc", description: "", price: 285000, stock: 50, images: "[]", categoryId: categoryIds[0] },
        },
        {
          id: "oi100000-0000-0000-0000-000000000002",
          orderId: orderIds[0],
          productId: productIds[1],
          qty: 1,
          price: 450000,
          product: { id: productIds[1], name: "Đại Việt Sử Ký Toàn Thư", slug: "dai-viet-su-ky-toan-thu", description: "", price: 450000, stock: 30, images: "[]", categoryId: categoryIds[0] },
        },
      ],
    },
    {
      id: orderIds[1],
      userId: userIds[0],
      total: 520000,
      payment: "VNPAY",
      createdAt: "2025-07-18T14:00:00Z",
      status: 1,
      user: users[0],
      orderItems: [
        {
          id: "oi200000-0000-0000-0000-000000000001",
          orderId: orderIds[1],
          productId: productIds[3],
          qty: 1,
          price: 520000,
          product: { id: productIds[3], name: "Mô hình Khuê Văn Các", slug: "mo-hinh-khue-van-cac", description: "", price: 520000, stock: 15, images: "[]", categoryId: categoryIds[2] },
        },
      ],
    },
    {
      id: orderIds[2],
      userId: userIds[1],
      total: 1550000,
      payment: "VNPAY",
      createdAt: "2025-07-15T10:00:00Z",
      status: 2,
      user: users[1],
      orderItems: [
        {
          id: "oi300000-0000-0000-0000-000000000001",
          orderId: orderIds[2],
          productId: productIds[4],
          qty: 1,
          price: 1200000,
          product: { id: productIds[4], name: "Áo dài truyền thống", slug: "ao-dai-truyen-thong", description: "", price: 1200000, stock: 10, images: "[]", categoryId: categoryIds[2] },
        },
        {
          id: "oi300000-0000-0000-0000-000000000002",
          orderId: orderIds[2],
          productId: productIds[5],
          qty: 1,
          price: 350000,
          product: { id: productIds[5], name: "Bản đồ Đại Việt cổ", slug: "ban-do-dai-viet-co", description: "", price: 350000, stock: 20, images: "[]", categoryId: categoryIds[1] },
        },
      ],
    },
    {
      id: orderIds[3],
      userId: userIds[0],
      total: 180000,
      payment: "VNPAY",
      createdAt: "2025-07-10T16:00:00Z",
      status: 3,
      user: users[0],
      orderItems: [
        {
          id: "oi400000-0000-0000-0000-000000000001",
          orderId: orderIds[3],
          productId: productIds[2],
          qty: 1,
          price: 180000,
          product: { id: productIds[2], name: "Tranh Đông Hồ - Đám cưới chuột", slug: "tranh-dong-ho", description: "", price: 180000, stock: 25, images: "[]", categoryId: categoryIds[1] },
        },
      ],
    },
    {
      id: orderIds[4],
      userId: userIds[1],
      total: 285000,
      payment: "",
      createdAt: "2025-07-05T08:00:00Z",
      status: 4,
      user: users[1],
      orderItems: [
        {
          id: "oi500000-0000-0000-0000-000000000001",
          orderId: orderIds[4],
          productId: productIds[0],
          qty: 1,
          price: 285000,
          product: { id: productIds[0], name: "Việt Nam Sử Lược - Trần Trọng Kim", slug: "viet-nam-su-luoc", description: "", price: 285000, stock: 50, images: "[]", categoryId: categoryIds[0] },
        },
      ],
    },
  ];

  // --- Current user profile (for /users/me) ---
  const currentUser = {
    id: userIds[0],
    name: "Nguyễn Văn An",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    email: "nguyenvanan@gmail.com",
    verifiedAt: "2025-01-10T00:00:00Z",
  };

  // ============================================================
  // 🔀 RESPONSE INTERCEPTOR — chặn API calls, trả mock data
  // ============================================================
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const config = error.config as InternalAxiosRequestConfig;
      if (!config || !config.url) return Promise.reject(error);

      const url = config.url.toLowerCase();
      const method = (config.method || "get").toLowerCase();

      // Helper to create mock response
      const mockResponse = (data: unknown): AxiosResponse => ({
        data,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      });

      // --- GET routes ---
      if (method === "get") {
        // Articles
        if (url.includes("/article/published")) {
          return Promise.resolve(mockResponse(articles));
        }
        if (url.match(/\/article\/[a-z0-9-]+$/i)) {
          const id = url.split("/").pop();
          const article = articles.find((a) => a.id === id);
          return Promise.resolve(mockResponse(article || articles[0]));
        }

        // Eras
        if (url.includes("/era/active") || url === "/era") {
          return Promise.resolve(mockResponse(eras));
        }
        if (url.match(/\/era\/[a-z0-9-]+$/i)) {
          const id = url.split("/").pop();
          const era = eras.find((e) => e.id === id);
          return Promise.resolve(mockResponse(era || eras[0]));
        }

        // Podcasts
        if (url.includes("/podcast/with-episodes")) {
          return Promise.resolve(mockResponse(podcasts));
        }
        if (url.match(/\/podcast\/[a-z0-9-]+$/i)) {
          const id = url.split("/").pop();
          const podcast = podcasts.find((p) => p.id === id);
          return Promise.resolve(mockResponse(podcast || podcasts[0]));
        }

        // Products
        if (url.match(/\/product\/[a-z0-9-]+$/i)) {
          const id = url.split("/").pop();
          const product = products.find((p) => p.id === id);
          return Promise.resolve(mockResponse(product || products[0]));
        }
        if (url.includes("/product")) {
          return Promise.resolve(mockResponse(products));
        }

        // Categories
        if (url.includes("/category/active") || url.includes("/category")) {
          return Promise.resolve(mockResponse(categories));
        }

        // Orders
        if (url.includes("/order/me")) {
          return Promise.resolve(mockResponse(orders.filter((o) => o.userId === userIds[0])));
        }
        if (url.match(/\/order\/user\/[a-z0-9-]+$/i)) {
          const userId = url.split("/").pop();
          return Promise.resolve(mockResponse(orders.filter((o) => o.userId === userId)));
        }
        if (url.includes("/order")) {
          return Promise.resolve(mockResponse(orders));
        }

        // Users
        if (url.includes("/users/me")) {
          return Promise.resolve(mockResponse(currentUser));
        }
        if (url.match(/\/users?\/[a-z0-9-]+$/i)) {
          const id = url.split("/").pop();
          const user = users.find((u) => u.id === id);
          return Promise.resolve(mockResponse(user || users[0]));
        }
        if (url.includes("/user") || url.includes("/users")) {
          return Promise.resolve(mockResponse(users));
        }
      }

      // --- POST routes ---
      if (method === "post") {
        if (url.includes("/auth/login")) {
          return Promise.resolve(
            mockResponse({
              success: true,
              token:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
                btoa(
                  JSON.stringify({
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress":
                      "nguyenvanan@gmail.com",
                    role: "User",
                    exp: Math.floor(Date.now() / 1000) + 86400,
                  })
                ) +
                ".mock-signature",
              user: { role: "User" },
            })
          );
        }
        if (url.includes("/auth/register")) {
          return Promise.resolve(mockResponse({ success: true }));
        }
        if (url.includes("/order")) {
          return Promise.resolve(
            mockResponse({
              id: "new-order-id",
              status: 0,
              total: 0,
              createdAt: new Date().toISOString(),
            })
          );
        }
      }

      // --- PUT routes ---
      if (method === "put") {
        if (url.includes("/users/me/password")) {
          return Promise.resolve(mockResponse({ success: true }));
        }
        if (url.includes("/users/me")) {
          return Promise.resolve(mockResponse({ ...currentUser, ...JSON.parse(config.data || "{}") }));
        }
        if (url.includes("/order/status")) {
          const orderId = url.split("/").pop();
          const order = orders.find((o) => o.id === orderId);
          if (order) {
            const payload = JSON.parse(config.data || "{}");
            return Promise.resolve(mockResponse({ ...order, status: payload.status ?? order.status + 1 }));
          }
        }
      }

      // Fallback — return empty array for unknown GET routes
      if (method === "get") {
        return Promise.resolve(mockResponse([]));
      }

      return Promise.reject(error);
    }
  );
}

export default api;
