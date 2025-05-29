## はじめに

### 環境・バージョン等

- Windows11 WSL2 Ubuntu
- PHP Composer
- Laravel
- Node npm
- Docker DockerCompose

### あらかじめインストールしておく

- node
- php
- composer
- docker
- dockercompose

### 環境構築手順

以下の非公式サイト2ページを順番に実行する

1. [laravelのインストール](https://readouble.com/laravel/11.x/ja/installation.html)
～ここに実行するコマンドを書く～


2. [Laravel sailの説明](https://readouble.com/laravel/11.x/ja/sail.html)
～ここに実行するコマンドを書く～


今回はReact(typescript), inertia.js, mysqlを使用したいので選択した内容はそれぞれ以下の通り

~画像~

**注意事項：**
- Laravel Sail初回実行時10分程度かかるので気長に待つ
- sailコマンドを毎回venderから入力するのは手間なのでパスを通す

パスを通す手順：
1. `vi ~/.bashrc` を実行
2. 以下を追記
alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'
3. 保存後に再読み込み
source ~/.bashrc


実行完了したら下記のコマンドを実行：
sail up -d
sail artisan migrate
sail npm install
sail npm run dev
text

[起動するかチェック](http://localhost/)

ディレクトリ名をjs→tsに変更する
変更箇所
/resources/jsで検索して/resources/tsに置換する
.vite.config.tsに書き換えて以下を追記
    resolve: {
        alias: {
            '@': '/resources/ts',
        },
    },
→記載しないとインポートエラーになる

## テストの実行

### PHPテスト（Pest）
プロジェクトではPestフレームワークを使用してテストを作成しています。

```bash
# 全てのテストを実行
php artisan test

# 特定のテストファイルを実行
php artisan test tests/Feature/BookShelfControllerTest.php

# カバレッジレポート付きで実行
php artisan test --coverage

# 並列実行（高速化）
php artisan test --parallel
```

### テストデータベース
テスト実行時は自動的にインメモリSQLiteデータベースを使用します。
本番データベースには影響しません。

### テストの書き方
新しいテストを作成する場合は、`TESTING.md`を参照してください。

詳細なテストガイドラインは以下を参照：
- [TESTING.md](./TESTING.md) - テスト戦略とガイドライン
- [CLAUDE.md](./CLAUDE.md) - プロジェクトルールとコーディング規約