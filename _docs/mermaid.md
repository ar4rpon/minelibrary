users {
    string user_id pk
    string email uk
    string password
    string user_name
    string profile_image
    string profile_message
    boolean is_memo_publish
    string reset_token
    datetime reset_token_expiry
    datetime created_at
    datetime updated_at
}

book {
    string isbn pk
    string title
    string author
    string publisher
    date publish_date
    string image_url
    datetime created_at
    datetime updated_at
}

category {
    int category_id pk
    string category_name
    int parent_category_id fk
    datetime created_at
    datetime updated_at
}

memo {
    int memo_id pk
    string isbn fk
    string user_id fk
    string memo
    int memo_chapter
    int memo_page
    boolean is_public
    datetime created_at
    datetime updated_at
}

favorite_book {
    int favorite_id pk
    string isbn fk
    string user_id fk
    enum read_status
    datetime created_at
}

book_list {
    int book_list_id pk
    string book_list_name
    string description
    string create_by_user_id fk
    boolean is_public
    datetime created_at
    datetime updated_at
}

book_list_item {
    int book_list_item_id pk
    int book_list_id fk
    string isbn fk
    datetime created_at
}

favorite_book_list {
    int favorite_id pk
    int book_list_id fk
    string user_id fk
    datetime created_at
}

share_link {
    int share_link_id pk
    string share_link_url
    int book_list_id fk
    datetime expiry_date
    datetime created_at
}

users ||--o{ memo : "creates"
users ||--o{ favorite_book : "favorites"
users ||--o{ book_list : "owns"
users ||--o{ favorite_book_list : "favorites"
book ||--o{ favorite_book : "is_favorited_in"
book ||--o{ memo : "has"
book }o--o{ category : "belongs_to"
book_list ||--o{ book_list_item : "contains"
book ||--o{ book_list_item : "is_included_in"
book_list ||--o{ favorite_book_list : "is_favorited_in"
book_list ||--o| share_link : "has"
category ||--o{ category : "has_parent"
