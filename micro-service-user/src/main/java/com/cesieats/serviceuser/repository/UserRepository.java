package com.cesieats.serviceuser.repository;

import com.cesieats.serviceuser.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


}
