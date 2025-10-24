from pydantic import BaseModel
from typing import List

class ConversionRate(BaseModel):
    discount_type: str
    conversion_rate: float
    avg_discount: float

class MonthlyStat(BaseModel):
    month: str
    views: int | None = None
    usage: int | None = None
    count: int | None = None

class BrandPerformance(BaseModel):
    brand: str
    coupons: int
    views: int
    usage: int
    shares: int
    conversion_rate: float

class CategoryPerformance(BaseModel):
    category: str
    coupons: int
    views: int
    usage: int
    avg_discount: float
    conversion_rate: float

class TopCoupon(BaseModel):
    id: str
    brand: str
    code: str
    views: int
    usage: int
    shares: int
    conversion_rate: float

class GeoPerformance(BaseModel):
    region: str
    users: int
    views: int
    usage: int

class DevicePerformance(BaseModel):
    device: str
    users: int
    percentage: float
    conversion_rate: float

class PeakHour(BaseModel):
    hour: str
    views: int
    usage: int

class AnalyticsResponse(BaseModel):
    total_coupons: int
    active_coupons: int
    total_users: int
    total_brands: int
    total_categories: int
    total_views: int
    total_usage: int
    total_shares: int
    conversion_rate: float
    average_discount_value: float
    new_users_this_month: int
    active_users_this_month: int
    user_retention_rate: float
    average_session_duration: float
    # total_favorites: int

    coupon_conversion_rates: List[ConversionRate]
    monthly_coupons: List[MonthlyStat]
    monthly_views: List[MonthlyStat]
    monthly_usage: List[MonthlyStat]
    brand_performance: List[BrandPerformance]
    category_performance: List[CategoryPerformance]
    top_coupons: List[TopCoupon]
    geographic_performance: List[GeoPerformance]
    device_analytics: List[DevicePerformance]
    peak_hours: List[PeakHour]
