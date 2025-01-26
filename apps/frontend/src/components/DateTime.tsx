export const DateTime = ({ date }: { date: string }) => {
  return <span>{new Date(date).toLocaleDateString()}</span>
}