## git cloneしたらやること

[!NOTE]
※sailはエイリアス設定済みの想定

1. 手順

```
 $ git clone git@github.com:ar4rpon/practice_docker.git
 $ cp .env.example .env\
 .env→DB_USERNAMEとDB_PASSWORDを記入する\
  ex.user,password
 $ composer install\
 $ sail up -d\
 $ sail artisan key:generate\
 $ sail artisan migrate\
 $ sail npm install\
 $ sail npm run dev\
```

2. 上手くいかない場合試すこと
   [!TIP]
   大体DBコンテナが起動出来てないorDBコンテナに接続できてない

- `$ sail ps`でmysqlコンテナが起動してるか確認→ある場合は接続ミスなのでenvファイルに問題がある可能性が高い
- コンテナを増やした場合該当のXX_HOST:127.0.0.1をコンテナ名に変更する
- コンテナキャッシュを削除して立て直す

    - $ sail down --rmi all --volumes --remove-orphans\
        - 参考：[リンク]("https://qiita.com/suin/items/19d65e191b96a0SQLSTATE[HY000]%20[2002]%20Connection%20refused%20(Connection:%20mysql,%20SQL:%20select%20exists%20(select%201%20from%20information_schema.tables%20where%20table_schema79417")
    - $ sail up -d

- キャッシュディレクトリの権限を設定する（関係ないかも）
  $ chmod 755 -R bootstrap/cache\
  $ chmod 755 -R storage\
