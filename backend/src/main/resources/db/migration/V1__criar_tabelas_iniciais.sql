CREATE TABLE ref_expense_category (
                                      id BIGSERIAL PRIMARY KEY,
                                      category_name VARCHAR(255) NOT NULL
);

CREATE TABLE trx_expense (
                             id BIGSERIAL PRIMARY KEY,
                             expense_description VARCHAR(255) NOT NULL,
                             expense_amount INTEGER NOT NULL,
                             expense_date TIMESTAMP WITH TIME ZONE NOT NULL,
                             payment_method VARCHAR(255) NOT NULL,
                             id_ref_expense_category BIGINT NOT NULL,
                             CONSTRAINT fk_expense_category FOREIGN KEY (id_ref_expense_category) REFERENCES ref_expense_category(id)
);
