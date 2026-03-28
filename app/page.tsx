import ProfileForm from '../components/ProfileForm'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">个人资料</h1>
      <ProfileForm />
    </main>
  )
}
