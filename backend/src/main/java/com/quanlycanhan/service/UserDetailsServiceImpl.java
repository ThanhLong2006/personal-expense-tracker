package com.quanlycanhan.service;

import com.quanlycanhan.entity.User;
import com.quanlycanhan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

/**
 * UserDetailsService implementation
 * - Load user từ database theo email
 * - Convert User entity thành UserDetails cho Spring Security
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Tìm user theo email
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user với email: " + email));

        // Kiểm tra tài khoản có bị khóa không
        if (user.getStatus() == User.UserStatus.LOCKED) {
            // Kiểm tra thời gian khóa đã hết chưa
            if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(java.time.LocalDateTime.now())) {
                throw new UsernameNotFoundException("Tài khoản đang bị khóa đến: " + user.getLockedUntil());
            } else {
                // Hết thời gian khóa, mở khóa tài khoản
                user.setStatus(User.UserStatus.ACTIVE);
                user.setFailedLoginAttempts(0);
                user.setLockedUntil(null);
                userRepository.save(user);
            }
        }

        // Kiểm tra tài khoản có bị vô hiệu hóa không
        if (user.getStatus() == User.UserStatus.DISABLED) {
            throw new UsernameNotFoundException("Tài khoản đã bị vô hiệu hóa");
        }

        // Kiểm tra tài khoản đã xác thực OTP chưa
        if (user.getStatus() == User.UserStatus.PENDING) {
            throw new UsernameNotFoundException("Tài khoản chưa xác thực OTP");
        }

        // Trả về UserDetails
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .authorities(getAuthorities(user))
            .accountExpired(false)
            .accountLocked(user.getStatus() == User.UserStatus.LOCKED)
            .credentialsExpired(false)
            .disabled(user.getStatus() == User.UserStatus.DISABLED || user.getStatus() == User.UserStatus.PENDING)
            .build();
    }

    /**
     * Lấy authorities (roles) của user
     */
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        // Tạo authority từ role (ROLE_USER hoặc ROLE_ADMIN)
        String role = "ROLE_" + user.getRole().name();
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }
}

