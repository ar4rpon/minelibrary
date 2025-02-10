import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/Components/ui/card';
import { Link } from '@inertiajs/react';

type StackedImageCardProps = {
  image: string;
  title: string;
  description: string;
};

function BookShelfCard({ image, title, description }: StackedImageCardProps) {
  return (
    <Link href="/bookshelfdetail">
      <Card className="mx-auto w-full overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-row gap-4">
            <div className="flex items-center">
              <img
                src={image ? image : 'dummy'}
                alt="Book Image"
                className="h-24 w-20 rounded-md border-2 object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col">
              <CardTitle className="text-lg font-bold">{title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default BookShelfCard;
