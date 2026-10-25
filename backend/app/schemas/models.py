from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class FilterParams(BaseModel):
    category: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    season: Optional[str] = None
    subscription_status: Optional[str] = None
    payment_method: Optional[str] = None
    shipping_type: Optional[str] = None
    discount_applied: Optional[str] = None
    promo_code_used: Optional[str] = None
    age_group: Optional[str] = None
    use_cleaned: bool = True


class ColumnInfo(BaseModel):
    name: str
    dtype: str
    non_null_count: int
    null_count: int
    unique_count: int
    sample_values: List[Any]


class DatasetSummaryResponse(BaseModel):
    filename: str
    row_count: int
    column_count: int
    file_size_kb: float
    is_cleaned: bool
    columns: List[ColumnInfo]
    available_filters: Dict[str, List[str]]


class DataQualityResponse(BaseModel):
    missing_values: Dict[str, int]
    total_missing_cells: int
    duplicate_rows: int
    duplicate_customer_ids: int
    inconsistent_values: int
    data_types_fixed: int
    health_score: float
    column_quality: List[Dict[str, Any]]


class CleanDatasetRequest(BaseModel):
    impute_missing_rating: bool = True
    imputation_strategy: str = "category_mean"  # "category_mean", "overall_mean", "category_median"
    trim_whitespace: bool = True
    remove_duplicates: bool = True


class CleaningResultResponse(BaseModel):
    success: bool
    message: str
    records_before: int
    records_after: int
    missing_before: int
    missing_after: int
    duplicates_removed: int
    whitespace_trimmed_cols: int
    operations_log: List[str]


class KPISummaryResponse(BaseModel):
    total_customers: int
    total_purchase_amount: float
    avg_purchase_amount: float
    avg_review_rating: float
    total_records: int
    subscription_rate_pct: float
    avg_previous_purchases: float
    top_category: str
    top_location: str
    top_payment_method: str
    top_shipping_type: str


class InsightItem(BaseModel):
    title: str
    value: str
    subtitle: str
    category: str


class DashboardDataResponse(BaseModel):
    kpis: KPISummaryResponse
    insights: List[InsightItem]
    purchase_by_category: Dict[str, Any]
    customer_distribution_gender: Dict[str, Any]
    top_products: Dict[str, Any]
    review_ratings_by_category: Dict[str, Any]
    seasonal_distribution: Dict[str, Any]
    filters_applied: Dict[str, Any]


class CustomerAnalyticsResponse(BaseModel):
    age_distribution: Dict[str, Any]
    gender_distribution: Dict[str, Any]
    location_distribution: Dict[str, Any]
    subscription_distribution: Dict[str, Any]
    previous_purchases_distribution: Dict[str, Any]
    purchase_by_age_group: Dict[str, Any]
    purchase_by_gender: Dict[str, Any]
    age_group_summary_table: List[Dict[str, Any]]
    insights: List[str]


class ShoppingPatternsResponse(BaseModel):
    category_sales: Dict[str, Any]
    top_items: Dict[str, Any]
    purchase_frequency: Dict[str, Any]
    discount_vs_regular: Dict[str, Any]
    payment_methods: Dict[str, Any]
    shipping_types: Dict[str, Any]
    size_distribution: Dict[str, Any]
    color_preferences: Dict[str, Any]
    avg_spend_by_category: Dict[str, Any]
    season_category_matrix: Dict[str, Any]
    items_ranking_table: List[Dict[str, Any]]
    insights: List[str]


class DataExplorerResponse(BaseModel):
    total_rows: int
    page: int
    page_size: int
    total_pages: int
    columns: List[str]
    rows: List[Dict[str, Any]]
    dataset_type: str  # "cleaned" or "original"
