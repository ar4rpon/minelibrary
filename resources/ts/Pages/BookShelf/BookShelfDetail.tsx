import BookCard from '@/Components/Book/BookCard';
import BookShelfDescription from '@/Components/BookShelf/BookShelfDescription';
import DefaultLayout from '@/Layouts/DefaultLayout';
import { Head } from '@inertiajs/react';

export default function BookShelfDetail() {
  const favorites = [
    {
      "isbn": "9784297141738",
      "read_status": "want_read",
      "created_at": "2025-02-25T01:55:59.000000Z",
      "book": {
        "title": "GitHub CI/CD実践ガイドーー持続可能なソフトウェア開発を支えるGitHub Actionsの設計と運用",
        "author": "野村 友規",
        "publisher_name": "技術評論社",
        "sales_date": "2024年05月29日頃",
        "image_url": "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/1738/9784297141738_1_4.jpg?_ex=300x300",
        "item_caption": "本書はCI/CDの設計や運用について、GitHubを使ってハンズオン形式で学ぶ書籍です。GitHub Actionsの基本構文からスタートし、テスト・静的解析・リリース・コンテナデプロイなどを実際に自動化していきます。あわせてDependabot・OpenID Connect・継続的なセキュリティ改善・GitHub Appsのような、実運用に欠かせないプラクティスも多数習得します。\n実装しながら設計や運用の考え方を学ぶことで、品質の高いソフトウェアをすばやく届けるスキルが身につきます。GitHubを利用しているなら、ぜひ手元に置いておきたい一冊です。",
        "item_price": 3740
      }
    },
    {
      "isbn": "9784774195391",
      "read_status": "want_read",
      "created_at": "2025-02-25T01:55:34.000000Z",
      "book": {
        "title": "はじめよう！システム設計",
        "author": "羽生章洋",
        "publisher_name": "技術評論社",
        "sales_date": "2018年02月",
        "image_url": "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5391/9784774195391.jpg?_ex=300x300",
        "item_caption": "ＡＩ・ＩｏＴ活用からレガシー対応まで、どうしたら、うまくいくんだろう？生産性と保守性・将来性を両立する、ＵＩ・プログラム・ＤＢ設計の肝、そのハウツーがこの一冊に。",
        "item_price": 2398
      }
    },
    {
      "isbn": "9784297132347",
      "read_status": "want_read",
      "created_at": "2025-02-25T01:55:26.000000Z",
      "book": {
        "title": "ちょうぜつソフトウェア設計入門ーーPHPで理解するオブジェクト指向の活用",
        "author": "田中 ひさてる",
        "publisher_name": "技術評論社",
        "sales_date": "2022年12月10日頃",
        "image_url": "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2347/9784297132347_1_5.jpg?_ex=300x300",
        "item_caption": "SoftwareDesign誌での連載と技術アドベントカレンダー24回ぶんに収まらなかった関連知識を徹底解説。いわゆる「オブジェクト指向」と呼ばれる考え方から発展した分野は、どのようにソフトウェア設計の役に立つのかを、よく知られた原則、テスト駆動開発、デザインパターンなどを通じて理解できる一冊です。上級者には定番の知識を体系的に整理するヒントとして、初級者には可愛いイラストで覚えるキーワード集として、幅広く活用していくことができます。なお、サンプルコードはPHPで書かれていますが、他の言語に置き換えて読めるコードばかりです。PHPを使っているかどうかを問わず、全ての開発者にオススメです。\n第 1章　クリーンアーキテクチャ\n第 2章　パッケージ原則\n第 3章　オブジェクト指向\n第 4章　UML（統一モデリング言語）\n第 5章　オブジェクト指向原則 SOLID\n第 6章　テスト駆動開発\n第 7章　依存性注入\n第 8章　デザインパターン\n第 9章　アジャイル開発",
        "item_price": 3080
      }
    },
    {
      "isbn": "9784798186627",
      "read_status": "want_read",
      "created_at": "2025-02-25T01:55:16.000000Z",
      "book": {
        "title": "達人に学ぶDB設計徹底指南書 第2版",
        "author": "ミック",
        "publisher_name": "翔泳社",
        "sales_date": "2024年08月28日頃",
        "image_url": "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6627/9784798186627_1_130.jpg?_ex=300x300",
        "item_caption": "本書は、プロのＤＢエンジニアである著者が、ＤＢ設計の基礎と実践ノウハウをやさしく手ほどきする『達人に学ぶＤＢ設計徹底指南書』の改訂・第２版です。第２版では、初期構成を活かしつつ、クラウド時代に対応した内容にアップデートしました。論理設計の基本から、正規化、パフォーマンスなど、押さえておくべき基礎知識やポイントを幅広く体系的に解説するだけでなく、やってはいけないアンチパターン、注意すべきグレーノウハウも丁寧に解説します。「ただ何となくやってはいけないと分かっている」「なぜかはちゃんと分かってないけど、注意するようにしている」で終わらせず、きちんと「なぜ」を理解することができます。また、豊富なサンプル、章ごとの練習問題もあるので、実際の開発現場でも通用する知識を徹底的に身につけることができます。ＤＢエンジニアを目指す人、ＤＢ設計の基礎と実践をしっかり学びたい人、脱初級を目指すＤＢエンジニアやアプリケーション開発者など、ＤＢ設計・開発に携わるすべての方におすすめの一冊です。",
        "item_price": 3080
      }
    },
    {
      "isbn": "9784297146221",
      "read_status": "reading",
      "created_at": "2025-02-25T01:55:13.000000Z",
      "book": {
        "title": "改訂新版　良いコード／悪いコードで学ぶ設計入門 -保守しやすい　成長し続けるコードの書き方",
        "author": "仙塲 大也",
        "publisher_name": "技術評論社",
        "sales_date": "2024年12月25日頃",
        "image_url": "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6221/9784297146221_1_31.jpg?_ex=300x300",
        "item_caption": "本書は、より成長させやすいコードの書き方と設計を学ぶ入門書です。筆者の経験をふまえ構成や解説内容を見直し、より実践的な一冊になりました。\nシステム開発では、ソフトウェアの変更が難しくなる事態が頻発します。 コードの可読性が低く調査に時間がかかる、 コードの影響範囲が不明で変更すると動かなくなる、 新機能を追加したいがどこに実装すればいいかわからない......。\n変更しづらいコードは、成長できないコードです。 ビジネスの進化への追随や、機能の改善が難しくなります。\n成長できないコードの問題を、設計で解決します。",
        "item_price": 3520
      }
    }
  ];
  return (
    <DefaultLayout header="FavoriteBookList">
      <Head title="FavoriteBookList" />

      {/* <div className="rounded-sm border border-green-600 bg-white shadow-md">
        <h2 className="px-2 py-2 text-xl font-semibold md:px-4 md:py-4 md:text-2xl">
          BookShelfDetail
        </h2>
      </div> */}

      <BookShelfDescription />
      <div className="mt-8 grid grid-cols-1 gap-y-4">
        {favorites && favorites.length > 0 ? (
          favorites.map((item: any) => (
            <BookCard
              key={item.isbn}
              title={item.book.title}
              author={item.book.author}
              publisher_name={item.book.publisher_name || ''}
              sales_date={item.book.sales_date}
              image_url={item.book.image_url || ''}
              item_price={item.book.item_price}
              isbn={item.isbn}
              item_caption={item.book.item_caption || '説明はありません。'}
              variant="book-shelf"
              readStatus={item.read_status}
            />
          ))
        ) : (
          <p className="font-bold">お気に入りの書籍はありません</p>
        )}
      </div>
    </DefaultLayout>
  );
}
