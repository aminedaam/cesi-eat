package com.cesieats.serviceuser.repository;

import com.cesieats.serviceuser.entity.Parrainage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParrainageRepository extends JpaRepository<Parrainage, Long> {
}
