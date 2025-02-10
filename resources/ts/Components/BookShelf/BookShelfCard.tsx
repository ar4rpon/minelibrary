import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/Components/ui/card';
import { Link } from '@inertiajs/react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { EditBookShelfDialog } from '@/Dialog/BookShelf/EditBookShelfDialog';
import { DeleteBookShelfDialog } from '@/Dialog/BookShelf/DeleteBookShelfDialog';
import { useState } from 'react';

type StackedImageCardProps = {
  image: string;
  title: string;
  description: string;
};

function BookShelfCard({ image, title, description }: StackedImageCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };


  const confirmEdit = () => {
    console.log("Edit");
    setEditDialogOpen(false);
  };

  const confirmDelete = () => {
    console.log("Delete");
    setDeleteDialogOpen(false);
  };


  return (

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
            <div className="flex justify-between">
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => handleEdit()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete()}>
                    <Trash className="mr-2 h-4 w-4" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <CardDescription className="text-sm text-gray-600">
              {description}
            </CardDescription>
            <Link href="/bookshelfdetail"><Button className='mt-4 text-sm'>詳細を見る</Button></Link>
          </div>
        </div>
        <DeleteBookShelfDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
        <EditBookShelfDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={confirmEdit}
        />
      </CardContent>
    </Card>

  );
}

export default BookShelfCard;
