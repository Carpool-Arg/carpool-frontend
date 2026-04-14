import CompleteProfilePage from './CompleteProfile'

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const email = typeof params?.email === 'string' ? params.email : ''
  return <CompleteProfilePage queryEmail={email} />
}