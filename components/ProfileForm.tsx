'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface Profile {
  id: string
  name: string
  introduction: string
  photo_url: string
  birthday: string
  favorite_color: string
  created_at: string
  updated_at: string
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error: any) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: '00000000-0000-0000-0000-000000000000',
          name: profile.name,
          introduction: profile.introduction,
          birthday: profile.birthday,
          favorite_color: profile.favorite_color,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setMessage('保存成功！')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage('保存失败：' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    setMessage('')

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          photo_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', '00000000-0000-0000-0000-000000000000')

      if (updateError) throw updateError

      setProfile(prev => prev ? { ...prev, photo_url: publicUrl } : null)
      setMessage('头像上传成功！')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      setMessage('上传失败：' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <div 
            className="w-32 h-32 mx-auto rounded-full bg-gray-200 cursor-pointer overflow-hidden"
            onClick={() => avatarInputRef.current?.click()}
          >
            {profile?.photo_url ? (
              <img src={profile.photo_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                点击上传头像
              </div>
            )}
          </div>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <p className="mt-2 text-sm text-gray-600">点击头像上传</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            姓名
          </label>
          <input
            type="text"
            value={profile?.name || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入姓名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            自我介绍
          </label>
          <textarea
            value={profile?.introduction || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, introduction: e.target.value } : null)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入自我介绍"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            生日
          </label>
          <input
            type="date"
            value={profile?.birthday || ''}
            onChange={(e) => setProfile(prev => prev ? { ...prev, birthday: e.target.value } : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            喜欢的颜色
          </label>
          <input
            type="color"
            value={profile?.favorite_color || '#000000'}
            onChange={(e) => setProfile(prev => prev ? { ...prev, favorite_color: e.target.value } : null)}
            className="w-full h-12 px-1 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
