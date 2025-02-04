import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/Components/ui/dialog"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"

export function BaseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">ボタン</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編集</DialogTitle>
          <DialogDescription>
            <div className="flex mt-4 flex-col">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="memo">Memo</Label>
                <Input type="email" id="memo" placeholder="Memo" />
              </div>
              <div className="mt-6 flex justify-end">
                <Button type="submit" className="mr-4" >決定</Button>
                <DialogClose>
                  <Button variant="destructive">キャンセル</Button>
                </DialogClose>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
