import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/Components/ui/card';

type StackedImageCardProps = {
  image: string;
  title: string;
  description: string;
};

function BookShelfCard({ image, title, description }: StackedImageCardProps) {
  return (
    <Card className="mx-auto w-full overflow-hidden">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-row gap-4">
          {/* 左側の画像部分 */}
          <div className="relative h-32 w-24 flex-shrink-0">
            <img
              src={image ? image : 'dummy'}
              alt="Book Image"
              className="h-32 w-24 rounded-lg border object-cover"
            />
          </div>

          {/* 右側のテキスト部分 */}
          <div className="flex flex-1 flex-col">
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookShelfCard;
