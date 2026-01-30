"""Initial tables

Revision ID: 001
Revises:
Create Date: 2025-01-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Plans table
    op.create_table(
        'plans',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('code', sa.String(20), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('billing_cycle', sa.String(20), nullable=False, server_default='monthly'),
        sa.Column('features', sa.JSON(), nullable=True),
        sa.Column('limits', sa.JSON(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index('ix_plans_code', 'plans', ['code'])

    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('provider', sa.String(20), nullable=False, server_default='email'),
        sa.Column('provider_id', sa.String(255), nullable=True),
        sa.Column('business_type', sa.String(50), nullable=True),
        sa.Column('business_name', sa.String(100), nullable=True),
        sa.Column('business_number', sa.String(20), nullable=True),
        sa.Column('tax_type', sa.String(20), nullable=True, server_default='general'),
        sa.Column('profile_image', sa.String(500), nullable=True),
        sa.Column('marketing_agree', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('status', sa.String(20), nullable=False, server_default='active'),
        sa.Column('email_verified_at', sa.DateTime(), nullable=True),
        sa.Column('last_login_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_business_type', 'users', ['business_type'])
    op.create_index('ix_users_status', 'users', ['status'])

    # Categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('code', sa.String(10), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('name_en', sa.String(50), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('parent_code', sa.String(10), nullable=True),
        sa.Column('is_deductible', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('vat_deductible', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('sort_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )
    op.create_index('ix_categories_code', 'categories', ['code'])
    op.create_index('ix_categories_parent_code', 'categories', ['parent_code'])
    op.create_index('ix_categories_is_active', 'categories', ['is_active'])

    # Subscriptions table
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('plan_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='active'),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(), nullable=True),
        sa.Column('next_billing_date', sa.Date(), nullable=True),
        sa.Column('payment_method', sa.String(30), nullable=True),
        sa.Column('billing_key', sa.String(255), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['plan_id'], ['plans.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index('ix_subscriptions_status', 'subscriptions', ['status'])
    op.create_index('ix_subscriptions_next_billing_date', 'subscriptions', ['next_billing_date'])
    op.create_index('ix_subscriptions_user_id', 'subscriptions', ['user_id'])

    # Expenses table
    op.create_table(
        'expenses',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('description', sa.String(200), nullable=False),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('vat_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('payment_method', sa.String(30), nullable=True),
        sa.Column('evidence_type', sa.String(20), nullable=False, server_default='none'),
        sa.Column('vendor', sa.String(100), nullable=True),
        sa.Column('memo', sa.Text(), nullable=True),
        sa.Column('is_deductible', sa.Boolean(), nullable=True),
        sa.Column('ai_classified', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('ai_category_id', sa.Integer(), nullable=True),
        sa.Column('ai_confidence', sa.Numeric(3, 2), nullable=True),
        sa.Column('ai_reason', sa.Text(), nullable=True),
        sa.Column('is_confirmed', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['ai_category_id'], ['categories.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_expenses_user_id', 'expenses', ['user_id'])
    op.create_index('ix_expenses_date', 'expenses', ['date'])

    # Expense Images table
    op.create_table(
        'expense_images',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('expense_id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(500), nullable=False),
        sa.Column('ocr_text', sa.Text(), nullable=True),
        sa.Column('ocr_processed', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['expense_id'], ['expenses.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_expense_images_expense_id', 'expense_images', ['expense_id'])

    # Income Records table
    op.create_table(
        'income_records',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('description', sa.String(200), nullable=False),
        sa.Column('amount', sa.Numeric(12, 2), nullable=False),
        sa.Column('vat_amount', sa.Numeric(12, 2), nullable=True),
        sa.Column('evidence_type', sa.String(20), nullable=False, server_default='tax_invoice'),
        sa.Column('client_name', sa.String(100), nullable=True),
        sa.Column('memo', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_income_records_user_id', 'income_records', ['user_id'])
    op.create_index('ix_income_records_date', 'income_records', ['date'])

    # Chat Histories table
    op.create_table(
        'chat_histories',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.String(100), nullable=True),
        sa.Column('channel', sa.String(20), nullable=False),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('answer', sa.Text(), nullable=False),
        sa.Column('is_deductible', sa.Boolean(), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('confidence', sa.Numeric(3, 2), nullable=True),
        sa.Column('llm_provider', sa.String(30), nullable=True),
        sa.Column('llm_model', sa.String(50), nullable=True),
        sa.Column('input_tokens', sa.Integer(), nullable=True),
        sa.Column('output_tokens', sa.Integer(), nullable=True),
        sa.Column('response_time_ms', sa.Integer(), nullable=True),
        sa.Column('feedback', sa.String(10), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_chat_histories_user_id', 'chat_histories', ['user_id'])
    op.create_index('ix_chat_histories_session_id', 'chat_histories', ['session_id'])
    op.create_index('ix_chat_histories_created_at', 'chat_histories', ['created_at'])

    # Usage Logs table
    op.create_table(
        'usage_logs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('action_type', sa.String(30), nullable=False),
        sa.Column('channel', sa.String(20), nullable=True),
        sa.Column('year_month', sa.String(7), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_usage_logs_user_id', 'usage_logs', ['user_id'])
    op.create_index('ix_usage_logs_year_month', 'usage_logs', ['year_month'])

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(30), nullable=False),
        sa.Column('title', sa.String(100), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('data', sa.JSON(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('read_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_notifications_user_id', 'notifications', ['user_id'])
    op.create_index('ix_notifications_is_read', 'notifications', ['is_read'])

    # Notification Settings table
    op.create_table(
        'notification_settings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('email_enabled', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('push_enabled', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('kakao_enabled', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('tax_deadline_reminder', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('monthly_report', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('expense_reminder', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id')
    )
    op.create_index('ix_notification_settings_user_id', 'notification_settings', ['user_id'])


def downgrade() -> None:
    op.drop_table('notification_settings')
    op.drop_table('notifications')
    op.drop_table('usage_logs')
    op.drop_table('chat_histories')
    op.drop_table('income_records')
    op.drop_table('expense_images')
    op.drop_table('expenses')
    op.drop_table('subscriptions')
    op.drop_table('categories')
    op.drop_table('users')
    op.drop_table('plans')
