import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

import { getCurrentUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export default async function DashboardPage() {
  const cs = cookies()
  const supabase = createClient(cs)

  const { data } = await supabase.from("profiles").select("*").single()

  const { data: links } = await supabase
    .from("urls")
    .select("*")
    .order("created_at", { ascending: false })

  if (!data) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Links" text="Create and manage links.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {links?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {links.map((link) => (
              <div className="flex justify-between p-4">
                <div> {link.slug + " -> " + link.url} </div>
                <div className="flex items-center gap-4">
                  <span>{"Click Count: " + link.click_count}</span>
                  <form>
                    <Button
                      formAction={async () => {
                        "use server"
                        redirect(`/${link.slug}`)
                      }}
                    >
                      View
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No links created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any links yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
