import SignUpClient from "./SignUpClient";

export default function Page({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next ?? "/dashboard";
  return <SignUpClient next={next} />;
}
