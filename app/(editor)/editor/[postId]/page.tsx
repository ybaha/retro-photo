import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { Editor } from "@/components/editor";

interface EditorPageProps {
  params: { postId: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // const post = await getPostForUser(params.postId, user.id)
  const post = {} as Post;

  if (!post) {
    notFound();
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
      }}
    />
  );
}
