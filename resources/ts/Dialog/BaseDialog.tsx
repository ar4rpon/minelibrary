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
import { Textarea } from "@/Components/ui/textarea"
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
            <div className="flex mt-4 flex-col w-full">
              <div className="grid items-center text-left gap-1.5">
                <Label className="mb-1" htmlFor="memo" >Memo</Label>
                <Textarea id="memo" placeholder="Memo" >
                  ここに初期値を入力しておく
                </Textarea>
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
