import pandas as pd
import numpy as np
from typing import Dict, Any, List
from app.schemas.models import (
    KPISummaryResponse,
    InsightItem,
    DashboardDataResponse,
    CustomerAnalyticsResponse,
    ShoppingPatternsResponse,
)


class AnalyticsService:
    @staticmethod
    def calculate_dashboard(df: pd.DataFrame, filters_applied: Dict[str, Any]) -> DashboardDataResponse:
        if df.empty:
            empty_kpis = KPISummaryResponse(
                total_customers=0,
                total_purchase_amount=0.0,
                avg_purchase_amount=0.0,
                avg_review_rating=0.0,
                total_records=0,
                subscription_rate_pct=0.0,
                avg_previous_purchases=0.0,
                top_category="N/A",
                top_location="N/A",
                top_payment_method="N/A",
                top_shipping_type="N/A",
            )
            return DashboardDataResponse(
                kpis=empty_kpis,
                insights=[],
                purchase_by_category={"categories": [], "amounts": [], "counts": []},
                customer_distribution_gender={"labels": [], "values": [], "percentages": []},
                top_products={"products": [], "amounts": [], "counts": []},
                review_ratings_by_category={"categories": [], "ratings": []},
                seasonal_distribution={"seasons": [], "amounts": [], "counts": []},
                filters_applied=filters_applied,
            )

        total_records = len(df)
        total_customers = int(df["Customer ID"].nunique()) if "Customer ID" in df.columns else total_records
        total_purchase_amount = float(df["Purchase Amount (USD)"].sum()) if "Purchase Amount (USD)" in df.columns else 0.0
        avg_purchase_amount = round(float(df["Purchase Amount (USD)"].mean()), 2) if "Purchase Amount (USD)" in df.columns else 0.0
        avg_review_rating = round(float(df["Review Rating"].dropna().mean()), 2) if "Review Rating" in df.columns else 0.0

        sub_rate = 0.0
        if "Subscription Status" in df.columns:
            sub_count = int((df["Subscription Status"].str.lower() == "yes").sum())
            sub_rate = round((sub_count / total_records) * 100, 1)

        avg_prev_purchases = 0.0
        if "Previous Purchases" in df.columns:
            avg_prev_purchases = round(float(df["Previous Purchases"].mean()), 1)

        # Top values for quick summary
        top_category = df["Category"].mode()[0] if "Category" in df.columns and not df["Category"].empty else "N/A"
        top_location = df["Location"].mode()[0] if "Location" in df.columns and not df["Location"].empty else "N/A"
        top_payment = df["Payment Method"].mode()[0] if "Payment Method" in df.columns and not df["Payment Method"].empty else "N/A"
        top_shipping = df["Shipping Type"].mode()[0] if "Shipping Type" in df.columns and not df["Shipping Type"].empty else "N/A"

        kpis = KPISummaryResponse(
            total_customers=total_customers,
            total_purchase_amount=round(total_purchase_amount, 2),
            avg_purchase_amount=avg_purchase_amount,
            avg_review_rating=avg_review_rating,
            total_records=total_records,
            subscription_rate_pct=sub_rate,
            avg_previous_purchases=avg_prev_purchases,
            top_category=top_category,
            top_location=top_location,
            top_payment_method=top_payment,
            top_shipping_type=top_shipping,
        )

        # Chart 1: Purchase Amount by Category
        cat_data = {"categories": [], "amounts": [], "counts": [], "avg_spend": []}
        if "Category" in df.columns and "Purchase Amount (USD)" in df.columns:
            cat_group = df.groupby("Category")["Purchase Amount (USD)"].agg(["sum", "count", "mean"]).reset_index()
            cat_group = cat_group.sort_values(by="sum", ascending=False)
            cat_data = {
                "categories": cat_group["Category"].tolist(),
                "amounts": [round(float(x), 2) for x in cat_group["sum"].tolist()],
                "counts": [int(x) for x in cat_group["count"].tolist()],
                "avg_spend": [round(float(x), 2) for x in cat_group["mean"].tolist()],
            }

        # Chart 2: Customer Distribution by Gender
        gender_data = {"labels": [], "values": [], "percentages": []}
        if "Gender" in df.columns:
            gender_counts = df["Gender"].value_counts()
            labels = gender_counts.index.tolist()
            values = [int(v) for v in gender_counts.values.tolist()]
            percentages = [round((v / total_records) * 100, 1) for v in values]
            gender_data = {
                "labels": labels,
                "values": values,
                "percentages": percentages,
            }

        # Chart 3: Top 5 Products by Purchase Amount
        top_products = {"products": [], "amounts": [], "counts": []}
        if "Item Purchased" in df.columns and "Purchase Amount (USD)" in df.columns:
            prod_group = df.groupby("Item Purchased")["Purchase Amount (USD)"].agg(["sum", "count"]).reset_index()
            prod_group = prod_group.sort_values(by="sum", ascending=True).tail(5)  # for horizontal bar chart
            top_products = {
                "products": prod_group["Item Purchased"].tolist(),
                "amounts": [round(float(x), 2) for x in prod_group["sum"].tolist()],
                "counts": [int(x) for x in prod_group["count"].tolist()],
            }

        # Chart 4: Review Ratings by Category
        rating_by_cat = {"categories": [], "ratings": []}
        if "Category" in df.columns and "Review Rating" in df.columns:
            rating_group = df.groupby("Category")["Review Rating"].mean().reset_index()
            # Order to match Category order if available
            if cat_data["categories"]:
                order_map = {c: i for i, c in enumerate(cat_data["categories"])}
                rating_group["sort_key"] = rating_group["Category"].map(order_map)
                rating_group = rating_group.sort_values(by="sort_key").drop(columns=["sort_key"])
            rating_by_cat = {
                "categories": rating_group["Category"].tolist(),
                "ratings": [round(float(x), 2) for x in rating_group["Review Rating"].tolist()],
            }

        # Seasonal Distribution
        season_data = {"seasons": [], "amounts": [], "counts": []}
        if "Season" in df.columns and "Purchase Amount (USD)" in df.columns:
            season_order = ["Spring", "Summer", "Fall", "Winter"]
            s_group = df.groupby("Season")["Purchase Amount (USD)"].agg(["sum", "count"]).reindex(season_order).dropna().reset_index()
            season_data = {
                "seasons": s_group["Season"].tolist(),
                "amounts": [round(float(x), 2) for x in s_group["sum"].tolist()],
                "counts": [int(x) for x in s_group["count"].tolist()],
            }

        # Insights section (4 key customer insights)
        insights: List[InsightItem] = []
        if "Location" in df.columns:
            loc_counts = df["Location"].value_counts()
            top_loc_name = loc_counts.index[0]
            top_loc_count = int(loc_counts.iloc[0])
            top_loc_pct = round((top_loc_count / total_records) * 100, 1)
            insights.append(
                InsightItem(
                    title="Top Location",
                    value=top_loc_name,
                    subtitle=f"{top_loc_count:,} customers ({top_loc_pct}%)",
                    category="location",
                )
            )

        if "Category" in df.columns:
            cat_counts = df["Category"].value_counts()
            top_cat_name = cat_counts.index[0]
            top_cat_count = int(cat_counts.iloc[0])
            top_cat_pct = round((top_cat_count / total_records) * 100, 1)
            insights.append(
                InsightItem(
                    title="Most Popular Category",
                    value=top_cat_name,
                    subtitle=f"{top_cat_count:,} purchases ({top_cat_pct}%)",
                    category="category",
                )
            )

        if "Payment Method" in df.columns:
            pm_counts = df["Payment Method"].value_counts()
            top_pm_name = pm_counts.index[0]
            top_pm_count = int(pm_counts.iloc[0])
            top_pm_pct = round((top_pm_count / total_records) * 100, 1)
            insights.append(
                InsightItem(
                    title="Top Payment Method",
                    value=top_pm_name,
                    subtitle=f"{top_pm_count:,} transactions ({top_pm_pct}%)",
                    category="payment",
                )
            )

        if "Shipping Type" in df.columns:
            st_counts = df["Shipping Type"].value_counts()
            top_st_name = st_counts.index[0]
            top_st_count = int(st_counts.iloc[0])
            top_st_pct = round((top_st_count / total_records) * 100, 1)
            insights.append(
                InsightItem(
                    title="Top Shipping Type",
                    value=top_st_name,
                    subtitle=f"{top_st_count:,} orders ({top_st_pct}%)",
                    category="shipping",
                )
            )

        return DashboardDataResponse(
            kpis=kpis,
            insights=insights,
            purchase_by_category=cat_data,
            customer_distribution_gender=gender_data,
            top_products=top_products,
            review_ratings_by_category=rating_by_cat,
            seasonal_distribution=season_data,
            filters_applied=filters_applied,
        )

    @staticmethod
    def calculate_customers(df: pd.DataFrame) -> CustomerAnalyticsResponse:
        total = max(len(df), 1)

        # 1. Age Groups
        def get_age_group(age):
            if pd.isna(age):
                return "Unknown"
            if age <= 25:
                return "18-25"
            elif age <= 35:
                return "26-35"
            elif age <= 45:
                return "36-45"
            elif age <= 55:
                return "46-55"
            else:
                return "56+"

        df_copy = df.copy()
        df_copy["Age Group"] = df_copy["Age"].apply(get_age_group) if "Age" in df_copy.columns else "All"
        age_group_order = ["18-25", "26-35", "36-45", "46-55", "56+"]

        age_dist = df_copy["Age Group"].value_counts().reindex(age_group_order).fillna(0)
        age_data = {
            "groups": age_dist.index.tolist(),
            "counts": [int(x) for x in age_dist.values.tolist()],
            "percentages": [round((int(x) / total) * 100, 1) for x in age_dist.values.tolist()],
        }

        # 2. Gender
        gender_counts = df_copy["Gender"].value_counts() if "Gender" in df_copy.columns else pd.Series(dtype=int)
        gender_data = {
            "labels": gender_counts.index.tolist(),
            "counts": [int(x) for x in gender_counts.values.tolist()],
            "percentages": [round((int(x) / total) * 100, 1) for x in gender_counts.values.tolist()],
        }

        # 3. Location (Top 10 + others)
        loc_counts = df_copy["Location"].value_counts() if "Location" in df_copy.columns else pd.Series(dtype=int)
        top_locs = loc_counts.head(10)
        location_data = {
            "locations": top_locs.index.tolist(),
            "counts": [int(x) for x in top_locs.values.tolist()],
            "percentages": [round((int(x) / total) * 100, 1) for x in top_locs.values.tolist()],
            "total_locations": int(df_copy["Location"].nunique()) if "Location" in df_copy.columns else 0,
        }

        # 4. Subscription
        sub_counts = df_copy["Subscription Status"].value_counts() if "Subscription Status" in df_copy.columns else pd.Series(dtype=int)
        sub_data = {
            "labels": sub_counts.index.tolist(),
            "counts": [int(x) for x in sub_counts.values.tolist()],
            "percentages": [round((int(x) / total) * 100, 1) for x in sub_counts.values.tolist()],
        }

        # 5. Previous Purchases distribution (Bins)
        prev_bins = [0, 10, 20, 30, 40, 50]
        prev_labels = ["1-10", "11-20", "21-30", "31-40", "41-50"]
        if "Previous Purchases" in df_copy.columns:
            prev_cut = pd.cut(df_copy["Previous Purchases"], bins=prev_bins, labels=prev_labels, right=True)
            prev_counts = prev_cut.value_counts().reindex(prev_labels).fillna(0)
            prev_data = {
                "ranges": prev_counts.index.tolist(),
                "counts": [int(x) for x in prev_counts.values.tolist()],
                "percentages": [round((int(x) / total) * 100, 1) for x in prev_counts.values.tolist()],
            }
        else:
            prev_data = {"ranges": [], "counts": [], "percentages": []}

        # 6. Purchase amount by age group
        purchase_by_age = {"groups": [], "total_spend": [], "avg_spend": []}
        if "Purchase Amount (USD)" in df_copy.columns:
            age_agg = df_copy.groupby("Age Group")["Purchase Amount (USD)"].agg(["sum", "mean"]).reindex(age_group_order).fillna(0)
            purchase_by_age = {
                "groups": age_agg.index.tolist(),
                "total_spend": [round(float(x), 2) for x in age_agg["sum"].tolist()],
                "avg_spend": [round(float(x), 2) for x in age_agg["mean"].tolist()],
            }

        # 7. Purchase amount by gender
        purchase_by_gender = {"labels": [], "total_spend": [], "avg_spend": []}
        if "Gender" in df_copy.columns and "Purchase Amount (USD)" in df_copy.columns:
            gender_agg = df_copy.groupby("Gender")["Purchase Amount (USD)"].agg(["sum", "mean"])
            purchase_by_gender = {
                "labels": gender_agg.index.tolist(),
                "total_spend": [round(float(x), 2) for x in gender_agg["sum"].tolist()],
                "avg_spend": [round(float(x), 2) for x in gender_agg["mean"].tolist()],
            }

        # 8. Detailed Age Group summary table
        age_summary_table = []
        for group in age_group_order:
            sub_df = df_copy[df_copy["Age Group"] == group]
            if len(sub_df) > 0:
                count = len(sub_df)
                tot_spend = float(sub_df["Purchase Amount (USD)"].sum()) if "Purchase Amount (USD)" in sub_df.columns else 0.0
                avg_sp = float(sub_df["Purchase Amount (USD)"].mean()) if "Purchase Amount (USD)" in sub_df.columns else 0.0
                avg_rt = float(sub_df["Review Rating"].dropna().mean()) if "Review Rating" in sub_df.columns else 0.0
                sub_pct = float((sub_df["Subscription Status"].str.lower() == "yes").sum() / count * 100) if "Subscription Status" in sub_df.columns else 0.0
                age_summary_table.append({
                    "age_group": group,
                    "customer_count": count,
                    "pct_of_total": round((count / total) * 100, 1),
                    "total_spend": round(tot_spend, 2),
                    "avg_spend": round(avg_sp, 2),
                    "avg_rating": round(avg_rt, 2),
                    "subscription_rate": round(sub_pct, 1),
                })

        # Generate Data-Driven Insights
        insights: List[str] = []
        if len(age_summary_table) > 0:
            top_age = max(age_summary_table, key=lambda x: x["customer_count"])
            insights.append(f"The largest customer demographic belongs to the {top_age['age_group']} age bracket with {top_age['customer_count']:,} customers ({top_age['pct_of_total']}%).")
            top_spend_age = max(age_summary_table, key=lambda x: x["avg_spend"])
            insights.append(f"Customers in the {top_spend_age['age_group']} group have the highest average purchase value at ${top_spend_age['avg_spend']:.2f}.")
        
        if len(gender_counts) > 0:
            dominant_gender = gender_counts.index[0]
            dominant_pct = round((gender_counts.iloc[0] / total) * 100, 1)
            insights.append(f"{dominant_gender} customers represent the majority of transactions at {dominant_pct}%.")

        if "Subscription Status" in df_copy.columns:
            sub_yes = int((df_copy["Subscription Status"].str.lower() == "yes").sum())
            sub_pct = round((sub_yes / total) * 100, 1)
            insights.append(f"Subscription adoption sits at {sub_pct}%, indicating significant headroom for membership conversion campaigns.")

        return CustomerAnalyticsResponse(
            age_distribution=age_data,
            gender_distribution=gender_data,
            location_distribution=location_data,
            subscription_distribution=sub_data,
            previous_purchases_distribution=prev_data,
            purchase_by_age_group=purchase_by_age,
            purchase_by_gender=purchase_by_gender,
            age_group_summary_table=age_summary_table,
            insights=insights,
        )

    @staticmethod
    def calculate_shopping_patterns(df: pd.DataFrame) -> ShoppingPatternsResponse:
        total = max(len(df), 1)

        # 1. Category Sales
        cat_sales = {"categories": [], "total_spend": [], "record_count": [], "avg_spend": [], "avg_rating": []}
        if "Category" in df.columns:
            agg_dict = {"Purchase Amount (USD)": ["sum", "count", "mean"]}
            if "Review Rating" in df.columns:
                agg_dict["Review Rating"] = ["mean"]
            c_agg = df.groupby("Category").agg(agg_dict).reset_index()
            # Flatten multi-index
            c_agg.columns = ["Category", "sum", "count", "mean"] + (["rating_mean"] if "Review Rating" in df.columns else [])
            c_agg = c_agg.sort_values(by="sum", ascending=False)
            cat_sales = {
                "categories": c_agg["Category"].tolist(),
                "total_spend": [round(float(x), 2) for x in c_agg["sum"].tolist()],
                "record_count": [int(x) for x in c_agg["count"].tolist()],
                "avg_spend": [round(float(x), 2) for x in c_agg["mean"].tolist()],
                "avg_rating": [round(float(x), 2) for x in c_agg["rating_mean"].tolist()] if "Review Rating" in df.columns else [],
            }

        # 2. Top Items
        top_items = {"items": [], "amounts": [], "counts": []}
        if "Item Purchased" in df.columns and "Purchase Amount (USD)" in df.columns:
            item_agg = df.groupby("Item Purchased")["Purchase Amount (USD)"].agg(["sum", "count"]).reset_index()
            item_agg = item_agg.sort_values(by="sum", ascending=False).head(10)
            top_items = {
                "items": item_agg["Item Purchased"].tolist(),
                "amounts": [round(float(x), 2) for x in item_agg["sum"].tolist()],
                "counts": [int(x) for x in item_agg["count"].tolist()],
            }

        # 3. Purchase Frequency
        freq_data = {"labels": [], "counts": [], "percentages": []}
        if "Frequency of Purchases" in df.columns:
            f_counts = df["Frequency of Purchases"].value_counts()
            freq_data = {
                "labels": f_counts.index.tolist(),
                "counts": [int(x) for x in f_counts.values.tolist()],
                "percentages": [round((int(x) / total) * 100, 1) for x in f_counts.values.tolist()],
            }

        # 4. Discount vs Regular
        disc_data = {"labels": ["Discount Applied", "No Discount"], "counts": [0, 0], "percentages": [0.0, 0.0]}
        if "Discount Applied" in df.columns:
            yes_count = int((df["Discount Applied"].str.lower() == "yes").sum())
            no_count = total - yes_count
            disc_data = {
                "labels": ["Discount Applied", "No Discount"],
                "counts": [yes_count, no_count],
                "percentages": [round((yes_count / total) * 100, 1), round((no_count / total) * 100, 1)],
            }

        # 5. Payment Methods
        pm_data = {"methods": [], "counts": [], "amounts": [], "percentages": []}
        if "Payment Method" in df.columns and "Purchase Amount (USD)" in df.columns:
            pm_agg = df.groupby("Payment Method")["Purchase Amount (USD)"].agg(["count", "sum"]).reset_index()
            pm_agg = pm_agg.sort_values(by="sum", ascending=False)
            pm_data = {
                "methods": pm_agg["Payment Method"].tolist(),
                "counts": [int(x) for x in pm_agg["count"].tolist()],
                "amounts": [round(float(x), 2) for x in pm_agg["sum"].tolist()],
                "percentages": [round((int(x) / total) * 100, 1) for x in pm_agg["count"].tolist()],
            }

        # 6. Shipping Types
        st_data = {"types": [], "counts": [], "percentages": []}
        if "Shipping Type" in df.columns:
            st_counts = df["Shipping Type"].value_counts()
            st_data = {
                "types": st_counts.index.tolist(),
                "counts": [int(x) for x in st_counts.values.tolist()],
                "percentages": [round((int(x) / total) * 100, 1) for x in st_counts.values.tolist()],
            }

        # 7. Size Distribution
        size_data = {"sizes": [], "counts": [], "percentages": []}
        if "Size" in df.columns:
            size_order = ["S", "M", "L", "XL"]
            s_counts = df["Size"].value_counts().reindex(size_order).dropna()
            size_data = {
                "sizes": s_counts.index.tolist(),
                "counts": [int(x) for x in s_counts.values.tolist()],
                "percentages": [round((int(x) / total) * 100, 1) for x in s_counts.values.tolist()],
            }

        # 8. Color Preferences (Top 10)
        color_data = {"colors": [], "counts": []}
        if "Color" in df.columns:
            c_counts = df["Color"].value_counts().head(10)
            color_data = {
                "colors": c_counts.index.tolist(),
                "counts": [int(x) for x in c_counts.values.tolist()],
            }

        # 9. Season vs Category matrix
        season_cat_matrix = {"seasons": [], "categories": [], "matrix": []}
        if "Season" in df.columns and "Category" in df.columns:
            pivot = pd.crosstab(df["Season"], df["Category"])
            season_cat_matrix = {
                "seasons": pivot.index.tolist(),
                "categories": pivot.columns.tolist(),
                "matrix": pivot.values.tolist(),
            }

        # 10. Items Ranking Table (All 25 products)
        items_ranking = []
        if "Item Purchased" in df.columns and "Purchase Amount (USD)" in df.columns:
            items_grp = df.groupby(["Item Purchased", "Category"]).agg(
                total_spend=("Purchase Amount (USD)", "sum"),
                purchase_count=("Purchase Amount (USD)", "count"),
                avg_spend=("Purchase Amount (USD)", "mean"),
                avg_rating=("Review Rating", "mean") if "Review Rating" in df.columns else ("Purchase Amount (USD)", "count"),
            ).reset_index()
            items_grp = items_grp.sort_values(by="total_spend", ascending=False)
            rank = 1
            for _, row in items_grp.iterrows():
                items_ranking.append({
                    "rank": rank,
                    "item": row["Item Purchased"],
                    "category": row["Category"],
                    "total_spend": round(float(row["total_spend"]), 2),
                    "purchase_count": int(row["purchase_count"]),
                    "avg_spend": round(float(row["avg_spend"]), 2),
                    "avg_rating": round(float(row["avg_rating"]), 2) if "Review Rating" in df.columns else 0.0,
                })
                rank += 1

        # Insights
        insights: List[str] = []
        if len(cat_sales["categories"]) > 0:
            insights.append(f"{cat_sales['categories'][0]} dominates customer spending, generating ${cat_sales['total_spend'][0]:,.2f} ({round(cat_sales['total_spend'][0] / max(sum(cat_sales['total_spend']), 1) * 100, 1)}% of total spend).")
        if len(top_items["items"]) > 0:
            insights.append(f"Top-selling single item is '{top_items['items'][0]}' with ${top_items['amounts'][0]:,.2f} in total purchases.")
        if len(disc_data["percentages"]) > 0:
            insights.append(f"{disc_data['percentages'][0]}% of purchases used a promotional discount, showing steady promotional responsiveness.")
        if len(pm_data["methods"]) > 0:
            insights.append(f"{pm_data['methods'][0]} is the leading payment channel by transaction volume (${pm_data['amounts'][0]:,.2f}).")

        return ShoppingPatternsResponse(
            category_sales=cat_sales,
            top_items=top_items,
            purchase_frequency=freq_data,
            discount_vs_regular=disc_data,
            payment_methods=pm_data,
            shipping_types=st_data,
            size_distribution=size_data,
            color_preferences=color_data,
            avg_spend_by_category=cat_sales,
            season_category_matrix=season_cat_matrix,
            items_ranking_table=items_ranking,
            insights=insights,
        )
