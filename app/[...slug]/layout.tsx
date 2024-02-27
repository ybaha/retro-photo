type Props = {
  children: React.ReactNode;
};

export default function LinkLayout({ children }: Props) {
  return <div className="w-full">{children}</div>;
}
