from collections import defaultdict
from datetime import datetime
from app.models.Coupon import Coupon
from app.models.brand import Brands
from app.models.categories import Categorie
from app.models.user import User
from app.dto.analytics import (
    AnalyticsResponse,
    BrandPerformance,
    CategoryPerformance,
    TopCoupon,
    PeakHour,
    ConversionRate,
    MonthlyStat,
    GeoPerformance,
    DevicePerformance,
)

class AnalyticsService:

    @staticmethod
    async def get_analytics() -> AnalyticsResponse:
        # ---- Global counts ----
        total_coupons = await Coupon.count()
        active_coupons = await Coupon.find({"is_active": True}).count()
        total_users = await User.count()
        total_brands = await Brands.count()
        total_categories = await Categorie.count()

        coupons = await Coupon.find_all().to_list()
        users = await User.find_all().to_list()
        categories = await Categorie.find_all().to_list()

        # ---- Engagement ----
        total_views = sum(c.views for c in coupons)
        total_usage = sum(c.usage_count for c in coupons)
        total_shares = sum(c.shares for c in coupons)
        conversion_rate = (total_usage / total_views * 100) if total_views > 0 else 0
        avg_discount_value = (
            sum(c.discount_value or 0 for c in coupons) / len(coupons)
        ) if coupons else 0

        # ---- Monthly stats ----
        monthly_coupons = defaultdict(int)
        monthly_views = defaultdict(int)
        monthly_usage = defaultdict(int)
        for c in coupons:
            month = c.created_at.strftime("%Y-%m")
            monthly_coupons[month] += 1
            monthly_views[month] += c.views
            monthly_usage[month] += c.usage_count

        monthly_coupons_list = [{"month": m, "count": v} for m, v in monthly_coupons.items()]
        monthly_views_list = [{"month": m, "views": v} for m, v in monthly_views.items()]
        monthly_usage_list = [{"month": m, "usage": v} for m, v in monthly_usage.items()]

        # ---- Top  ----
        top_coupons = sorted(coupons, key=lambda c: c.usage_count, reverse=True)[:10]
        top_coupons_data = [
            TopCoupon(
                id=str(c.id),
                code=c.code,
                brand=c.brand,
                usage=c.usage_count,
                views=c.views,
                shares=c.shares,
                conversion_rate=round((c.usage_count / c.views * 100), 2) if c.views else 0,
            )
            for c in top_coupons
        ]

        brand_stats = []
        for brand in await Brands.find_all().to_list():
            brand_coupons = [c for c in coupons if c.brand == brand.name]
            views = sum(c.views for c in brand_coupons)
            usage = sum(c.usage_count for c in brand_coupons)
            shares = sum(c.shares for c in brand_coupons)
            conv = (usage / views * 100) if views else 0
            active = sum(1 for c in brand_coupons if c.is_active)
            inactive = len(brand_coupons) - active
            brand_stats.append(BrandPerformance(
                brand=brand.name,
                coupons=len(brand_coupons),
                active_coupons=active,
                inactive_coupons=inactive,
                views=views,
                usage=usage,
                shares=shares,
                conversion_rate=round(conv, 2),
            ))

        # ---- Category performance ----
        category_stats = []
        for cat in categories:
            cat_coupons = [c for c in coupons if c.category == cat.name]
            total_views = sum(c.views for c in cat_coupons)
            total_usage = sum(c.usage_count for c in cat_coupons)
            avg_discount = (
                sum(c.discount_value or 0 for c in cat_coupons) / len(cat_coupons)
            ) if cat_coupons else 0
            conversion_rate_cat = (total_usage / total_views * 100) if total_views > 0 else 0

            category_stats.append(CategoryPerformance(
                category=cat.name,
                coupons=len(cat_coupons),
                views=total_views,
                usage=total_usage,
                avg_discount=round(avg_discount, 2),
                conversion_rate=round(conversion_rate_cat, 2),
            ))

        # ---- Peak hours ----
        hourly_stats = defaultdict(lambda: {"views": 0, "usage": 0})
        for c in coupons:
            hour = c.created_at.strftime("%H:00")
            hourly_stats[hour]["views"] += c.views
            hourly_stats[hour]["usage"] += c.usage_count

        peak_hours_list = [
            PeakHour(hour=h, views=v["views"], usage=v["usage"])
            for h, v in hourly_stats.items()
        ]

        # ---- Return AnalyticsResponse DTO ----
        return AnalyticsResponse(
            total_coupons=total_coupons,
            active_coupons=active_coupons,
            total_users=total_users,
            total_brands=total_brands,
            total_categories=total_categories,
            total_views=total_views,
            total_usage=total_usage,
            total_shares=total_shares,
            conversion_rate=round(conversion_rate, 2),
            average_discount_value=round(avg_discount_value, 2),
            new_users_this_month=len(
                [u for u in users if u.created_at.month == datetime.utcnow().month]
            ),
            active_users_this_month=0,
            user_retention_rate=0.0,
            average_session_duration=0.0,
            coupon_conversion_rates=[],  # TODO: fill if needed
            monthly_coupons=monthly_coupons_list,
            monthly_views=monthly_views_list,
            monthly_usage=monthly_usage_list,
            brand_performance=brand_stats,
            category_performance=category_stats,
            top_coupons=top_coupons_data,
            geographic_performance=[],   # TODO: fill if needed
            device_analytics=[],         # TODO: fill if needed
            peak_hours=peak_hours_list,
        )
