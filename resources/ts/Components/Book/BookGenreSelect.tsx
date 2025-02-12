import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface BookGenreProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function BookGenreSelect({ onValueChange, value }: BookGenreProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="ジャンル" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="001">すべてのジャンル</SelectItem>
        <SelectItem value="001002">語学・学習参考書</SelectItem>
        <SelectItem value="001004">小説・エッセイ</SelectItem>
        <SelectItem value="001005">パソコン・システム開発</SelectItem>
        <SelectItem value="001006">ビジネス・経済・就職</SelectItem>
        <SelectItem value="001012">科学・技術</SelectItem>
        <SelectItem value="001016">資格・検定</SelectItem>
        <SelectItem value="001008">人文・思想・社会</SelectItem>
        <SelectItem value="001007">旅行・留学・アウトドア</SelectItem>
        <SelectItem value="001009">ホビー・スポーツ・美術</SelectItem>
        <SelectItem value="001010">美容・暮らし・健康・料理</SelectItem>
        <SelectItem value="001011">エンタメ・ゲーム</SelectItem>
        <SelectItem value="001013">写真集・タレント</SelectItem>
        <SelectItem value="001003">絵本・児童書・図鑑</SelectItem>
        <SelectItem value="001017">ライトノベル</SelectItem>
        <SelectItem value="001019">文庫</SelectItem>
        <SelectItem value="001001">漫画（コミック）</SelectItem>
        <SelectItem value="001028">医学・薬学・看護学・歯科学</SelectItem>
      </SelectContent>
    </Select>
  );
}
