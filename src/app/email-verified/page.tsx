import EmailVerifiedPage from './EmailVerified'

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const token = typeof params?.token === 'string' ? params.token : null
  return <EmailVerifiedPage token={token} />
}