package com.jhipsternative.app.repository;

import com.jhipsternative.app.domain.ProductCategory;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ProductCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {}
