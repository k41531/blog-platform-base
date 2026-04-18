import { PostEditor } from "@/components/features/editor/post-editor";

export default function NewPostPage() {
  return (
    <div className="fade-in">
      <div className="db-main-header">
        <div>
          <span className="en-label">NEW POST</span>
          <h1 className="db-main-title">新規記事作成</h1>
        </div>
      </div>
      <PostEditor mode="create" />
    </div>
  );
}
