import { notFound } from "next/navigation";

import { PostEditor } from "@/components/features/editor/post-editor";
import { getPostById } from "@/lib/actions/post-actions";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const result = await getPostById(id);

  if (!result.ok) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-bold">記事を編集</h1>
      <PostEditor mode="edit" post={result.value} />
    </div>
  );
}
