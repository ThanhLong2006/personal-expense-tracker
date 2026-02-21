import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { resetPassword } from '../../api/auth'
import toast from 'react-hot-toast'

/**
 * Trang đặt lại mật khẩu
 */
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('Đặt lại mật khẩu thành công!')
      navigate('/login')
    },
    onError: (error: unknown) => {
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Có lỗi xảy ra';
      toast.error(errorMessage);
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    mutation.mutate()
  }

  if (!token) {
    return (
      <div className="card bg-base-100 shadow-2xl">
        <div className="card-body p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Link không hợp lệ
          </h1>
          <p className="text-center">Token không tồn tại hoặc đã hết hạn</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-2xl">
      <div className="card-body p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Đặt lại mật khẩu
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Mật khẩu mới</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Xác nhận mật khẩu</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage

