import { PostEditor } from "@/components/features/editor/post-editor";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">新規記事作成</h1>
      <PostEditor mode="create" />
    </div>
  );
}
