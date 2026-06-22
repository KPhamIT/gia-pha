/** User guide page — marketing / end-user help (Facebook, onboarding). */
export const GUIDE_STRINGS = {
  GUIDE_PAGE_TITLE: "Hướng dẫn sử dụng",
  GUIDE_PAGE_SUBTITLE:
    "Tra cứu gia phả dòng họ trên điện thoại và máy tính — xem sổ, cây phả hệ, sự kiện, ngày giỗ.",
  GUIDE_TOC_TITLE: "Mục lục",
  GUIDE_IMAGE_PLACEHOLDER: "Chèn ảnh minh họa tại đây",
  GUIDE_CTA: "Vào sổ gia phả",
  GUIDE_CTA_HINT:
    "Cần liên kết từ ban quản trị dòng họ hoặc đăng nhập tài khoản được cấp.",
  GUIDE_NOTE_VIEW_ONLY:
    "Mọi người trong dòng họ có thể xem miễn phí qua liên kết. Chỉnh sửa và lưu dữ liệu cần tài khoản được quản trị viên cấp quyền.",
} as const;

export type GuideStep = {
  title: string;
  paragraphs: readonly string[];
  imageCaption?: string;
};

export type GuideSection = {
  id: string;
  title: string;
  intro?: string;
  steps: readonly GuideStep[];
};

export const GUIDE_SECTIONS: readonly GuideSection[] = [
  {
    id: "intro",
    title: "Gia phả điện tử là gì?",
    intro:
      "Ứng dụng giúp cả dòng họ cùng xem, tra cứu và gìn giữ thông tin tổ tiên, họ hàng qua nhiều thế hệ — mọi lúc, mọi nơi trên trình duyệt.",
    steps: [
      {
        title: "Ai dùng được?",
        paragraphs: [
          "Thành viên dòng họ chỉ cần mở liên kết do ban quản trị gửi (Zalo, Facebook, Messenger…).",
          "Không bắt buộc cài app — dùng trực tiếp trên Chrome, Safari, trình duyệt điện thoại.",
          "Sau lần đầu mở liên kết, thiết bị sẽ nhớ dòng họ của bạn; lần sau chỉ cần vào địa chỉ website.",
        ],
        imageCaption: "Màn hình chào mừng / trang sổ gia phả lần đầu mở.",
      },
      {
        title: "Bạn có thể làm gì?",
        paragraphs: [
          "Đọc sổ gia phả như cuốn sách điện tử — lật trang, in, tìm tên.",
          "Xem cây gia phả trực quan theo nhánh, theo đời.",
          "Theo dõi sự kiện dòng họ, đóng góp, công đức (nếu dòng họ có tổ chức).",
          "Xem ngày giỗ sắp tới, mở bài cúng để in hoặc chia sẻ.",
        ],
        imageCaption: "Tổng quan menu điều hướng (nút + góc màn hình).",
      },
    ],
  },
  {
    id: "start",
    title: "Bắt đầu — mở liên kết dòng họ",
    steps: [
      {
        title: "Nhận liên kết từ ban quản trị",
        paragraphs: [
          "Quản trị viên dòng họ gửi cho bạn một đường link dạng: …/join/…",
          "Chạm vào link trên điện thoại hoặc mở trên máy tính.",
          "Hệ thống xác nhận và đưa bạn vào sổ gia phả của đúng dòng họ — không lẫn với dòng họ khác.",
        ],
        imageCaption: "Tin nhắn Zalo/Facebook có liên kết join.",
      },
      {
        title: "Menu điều hướng nhanh",
        paragraphs: [
          "Góc dưới bên trái có nút **+** (menu tròn).",
          "Từ menu chọn: **Sổ gia phả**, **Cây gia phả**, **Sự kiện**, **Tài khoản**, **Thông báo**… tùy quyền của bạn.",
          "Trên từng trang, menu chỉ hiện các mục phù hợp để giao diện gọn, dễ dùng trên điện thoại.",
        ],
        imageCaption: "Menu + đang mở với các lựa chọn.",
      },
      {
        title: "Chọn nhánh (lần đầu vào cây)",
        paragraphs: [
          "Khi mở cây gia phả lần đầu, app có thể hỏi bạn thuộc nhánh nào.",
          "Chọn đúng nhánh để cây hiển thị phần liên quan đến bạn; có thể đổi lại trong bộ lọc trên cây.",
        ],
        imageCaption: "Hộp chọn nhánh khi vào cây gia phả.",
      },
    ],
  },
  {
    id: "book",
    title: "Sổ gia phả",
    intro:
      "Trang mặc định khi vào website — phù hợp đọc trên điện thoại, in ấn và chia sẻ với người lớn tuổi.",
    steps: [
      {
        title: "Lật trang & đọc thông tin",
        paragraphs: [
          "Chạm **cạnh trái / phải** màn hình để lật trang (hoặc dùng nút trang trước / trang sau).",
          "Mỗi trang là hồ sơ một thành viên: họ tên, đời, nhánh, ngày sinh, tiểu sử, mộ phần…",
          "Trang bìa và lời mở đầu giới thiệu dòng họ — do ban biên tập soạn.",
        ],
        imageCaption: "Một trang thông tin trong sổ gia phả.",
      },
      {
        title: "Tìm người trong sổ",
        paragraphs: [
          "Chạm biểu tượng **tìm kiếm** trên thanh công cụ sổ.",
          "Gõ họ tên → chọn kết quả → app chuyển đến đúng trang của người đó.",
        ],
        imageCaption: "Hộp tìm kiếm và kết quả.",
      },
      {
        title: "In sổ",
        paragraphs: [
          "**In trang này** — in đúng trang đang xem (hữu ích khi in bài về một người).",
          "**In toàn bộ sổ** — chuẩn bị bản in nhiều trang (nên dùng máy tính hoặc gửi file PDF qua máy in).",
        ],
        imageCaption: "Nút in trang / in toàn bộ trên thanh sổ.",
      },
      {
        title: "Mở cây gia phả từ sổ",
        paragraphs: [
          "Từ menu **+** hoặc nút trên sổ, chọn **Cây gia phả** để chuyển sang dạng sơ đồ quan hệ.",
        ],
        imageCaption: "Chuyển từ sổ sang cây.",
      },
    ],
  },
  {
    id: "tree",
    title: "Cây gia phả",
    intro: "Xem quan hệ cha — mẹ — con — vợ/chồng theo sơ đồ trực quan.",
    steps: [
      {
        title: "Xem và di chuyển trên cây",
        paragraphs: [
          "Kéo để di chuyển, chụm hai ngón để phóng to / thu nhỏ (trên điện thoại).",
          "Chạm vào **thẻ tên** một người để mở chi tiết: tiểu sử, quan hệ, mộ phần…",
        ],
        imageCaption: "Cây gia phả với vài thế hệ.",
      },
      {
        title: "Lọc theo nhánh và đời",
        paragraphs: [
          "Thanh **Bộ lọc** phía trên: chọn nhánh hoặc giới hạn số đời hiển thị.",
          "Giúp cây gọn hơn khi dòng họ đông người.",
        ],
        imageCaption: "Bộ lọc nhánh / đời trên cây.",
      },
      {
        title: "Tìm người trên cây",
        paragraphs: [
          "Menu **+** → **Tìm kiếm** (hoặc nút tìm trên cây).",
          "Chọn người → cây tự căn giữa vào vị trí của họ.",
        ],
        imageCaption: "Tìm kiếm và focus vào một node.",
      },
      {
        title: "Xuất ảnh cây (nếu được bật)",
        paragraphs: [
          "Người có quyền có thể xuất ảnh cây để in banner, đăng Facebook dòng họ.",
          "Chọn vùng hiển thị, tùy chỉnh trong hộp thoại xuất ảnh.",
        ],
        imageCaption: "Hộp thoại xuất ảnh cây gia phả.",
      },
    ],
  },
  {
    id: "person",
    title: "Hồ sơ thành viên",
    steps: [
      {
        title: "Xem thông tin",
        paragraphs: [
          "Từ cây hoặc sổ, mở hồ sơ một người để xem: thông tin cơ bản, gia đình (cha, mẹ, vợ/chồng, con), tiểu sử, thành tích, mộ phần.",
          "Tab **Quan hệ** liệt kê người thân có thể bấm để chuyển nhanh.",
        ],
        imageCaption: "Sheet chi tiết một thành viên.",
      },
      {
        title: "Chỉnh sửa (cần quyền)",
        paragraphs: [
          "Nút **Chỉnh sửa** chỉ hiện khi bạn đăng nhập và được admin cấp quyền sửa cây gia phả.",
          "Sau khi sửa, bấm **Lưu** — dữ liệu cập nhật cho cả dòng họ.",
          "Nếu chỉ xem được, liên hệ quản trị viên để được cấp tài khoản hoặc nhờ admin cập nhật giúp.",
        ],
        imageCaption: "Form chỉnh sửa thông tin thành viên.",
      },
    ],
  },
  {
    id: "events",
    title: "Sự kiện dòng họ",
    intro: "Theo dõi họp họ, giỗ tổ, các khoản đóng góp và sổ công đức.",
    steps: [
      {
        title: "Xem danh sách sự kiện",
        paragraphs: [
          "Menu **+** → **Sự kiện**.",
          "Mỗi sự kiện có tên, ngày, mô tả — loại **Thông tin** hoặc **Có thu tiền đóng góp**.",
        ],
        imageCaption: "Danh sách sự kiện dòng họ.",
      },
      {
        title: "Theo dõi đóng góp",
        paragraphs: [
          "Với sự kiện thu tiền: xem ai đã nộp, ai chưa, tổng đã thu.",
          "Ban quản trị cập nhật trạng thái; thành viên tra cứu minh bạch.",
        ],
        imageCaption: "Bảng đóng góp theo từng người.",
      },
      {
        title: "Sổ công đức",
        paragraphs: [
          "Ghi nhận tiền hoặc hiện vật công đức cho dòng họ (người trong hoặc ngoài gia phả).",
          "Lưu trữ lâu dài, in hoặc chia sẻ khi cần.",
        ],
        imageCaption: "Danh sách công đức của một sự kiện.",
      },
    ],
  },
  {
    id: "ceremonies",
    title: "Ngày giỗ & bài cúng",
    steps: [
      {
        title: "Xem ngày giỗ sắp tới",
        paragraphs: [
          "Menu **+** → **Ngày giỗ sắp tới** (hoặc mục tương ứng trong Tài khoản).",
          "Danh sách các ngày giỗ trong vài ngày tới theo âm lịch đã nhập trên hồ sơ.",
        ],
        imageCaption: "Trang ngày giỗ sắp tới.",
      },
      {
        title: "Mở bài cúng & in",
        paragraphs: [
          "Chạm **Xem bài cúng** tại một dòng → mở văn bài cúng theo mẫu dòng họ.",
          "Dùng **In trực tiếp** tại nhà thờ họ hoặc **Chia sẻ** link để người khác mở in trên máy của họ.",
        ],
        imageCaption: "Trang bài cúng và nút in / chia sẻ.",
      },
      {
        title: "Nhận thông báo ngày giỗ",
        paragraphs: [
          "Đăng nhập → **Cài đặt thông báo** → bật nhắc ngày giỗ trên trình duyệt.",
          "Cho phép thông báo khi trình duyệt hỏi — bạn sẽ được nhắc trước ngày giỗ.",
        ],
        imageCaption: "Màn hình cài đặt thông báo.",
      },
    ],
  },
  {
    id: "account",
    title: "Tài khoản & đăng nhập",
    steps: [
      {
        title: "Khi nào cần đăng nhập?",
        paragraphs: [
          "Xem sổ và cây: **không cần** đăng nhập nếu đã mở liên kết dòng họ.",
          "Đăng nhập khi bạn cần **lưu** chỉnh sửa, quản lý sự kiện, hoặc cài thông báo cá nhân.",
        ],
        imageCaption: "Trang đăng nhập.",
      },
      {
        title: "Liên kết với thành viên gia phả",
        paragraphs: [
          "Sau khi đăng nhập, vào **Tài khoản** → **Liên kết thành viên**.",
          "Chọn đúng tên bạn trên cây → **Lưu liên kết**.",
          "Giúp app hiển thị đúng nhánh và cá nhân hóa trải nghiệm.",
        ],
        imageCaption: "Chọn thành viên để liên kết tài khoản.",
      },
      {
        title: "Quản trị viên dòng họ",
        paragraphs: [
          "Admin có thêm mục quản lý user, chia sẻ **liên kết xem gia phả** cho cả dòng họ.",
          "Gửi link qua Facebook / Zalo để mọi người cùng tra cứu.",
        ],
        imageCaption: "Mục sao chép liên kết chia sẻ trong Tài khoản admin.",
      },
    ],
  },
  {
    id: "tips",
    title: "Mẹo dùng trên điện thoại",
    steps: [
      {
        title: "Thêm shortcut ra màn hình chính",
        paragraphs: [
          "iPhone (Safari): nút **Chia sẻ** → **Thêm vào Màn hình chính**.",
          "Android (Chrome): menu **⋮** → **Thêm vào màn hình chính** / **Cài ứng dụng**.",
          "Mở nhanh như app, không cần gõ địa chỉ mỗi lần.",
        ],
        imageCaption: "Thêm website vào màn hình chính điện thoại.",
      },
      {
        title: "Mạng yếu",
        paragraphs: [
          "Ưu tiên dùng **Sổ gia phả** khi sóng kém — nhẹ hơn cây tương tác.",
          "Đợi vài giây lần đầu tải; lần sau trình duyệt thường cache nhanh hơn.",
        ],
      },
      {
        title: "Cần hỗ trợ?",
        paragraphs: [
          "Liên hệ **người quản trị dòng họ** (thông tin trong trang đăng nhập hoặc do admin gửi kèm link).",
          "Ghi rõ tên bạn và thành viên cần tra cứu để admin hỗ trợ nhanh.",
        ],
      },
    ],
  },
] as const;
