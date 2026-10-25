import io
from datetime import datetime
import pandas as pd
from typing import Dict, Any

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)

from app.services.analytics_service import AnalyticsService


class ReportService:
    @staticmethod
    def generate_pdf_report(df: pd.DataFrame, dataset_name: str, is_cleaned: bool) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()
        # Custom palette matching dashboard UI
        c_primary = colors.HexColor("#0B1735")
        c_blue = colors.HexColor("#1769FF")
        c_purple = colors.HexColor("#7C3AED")
        c_light_bg = colors.HexColor("#F4F7FC")
        c_text = colors.HexColor("#15213B")
        c_muted = colors.HexColor("#64748B")
        c_green = colors.HexColor("#10B981")

        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=c_primary,
        )
        subtitle_style = ParagraphStyle(
            "DocSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=c_muted,
        )
        h1_style = ParagraphStyle(
            "Heading1",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=c_primary,
            spaceAfter=6,
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=c_text,
        )
        body_bold = ParagraphStyle(
            "BodyBold",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=c_text,
        )
        kpi_label = ParagraphStyle(
            "KPILabel",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=c_muted,
            alignment=1,
        )
        kpi_val = ParagraphStyle(
            "KPIVal",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=c_primary,
            alignment=1,
        )

        elements = []

        # 1. Header Banner
        elements.append(Paragraph("Retail Customer Behavior & Shopping Trends", title_style))
        elements.append(
            Paragraph(
                f"Executive Analytics Report &bull; Dataset: <b>{dataset_name}</b> ({'Cleaned' if is_cleaned else 'Original'}) &bull; Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                subtitle_style,
            )
        )
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceBefore=2, spaceAfter=12))

        # 2. Executive KPIs Section
        dash_data = AnalyticsService.calculate_dashboard(df, {})
        kpis = dash_data.kpis

        kpi_cells = [
            [
                Paragraph("TOTAL CUSTOMERS", kpi_label),
                Paragraph("TOTAL AMOUNT", kpi_label),
                Paragraph("AVG PURCHASE", kpi_label),
                Paragraph("AVG RATING", kpi_label),
                Paragraph("RECORDS", kpi_label),
            ],
            [
                Paragraph(f"{kpis.total_customers:,}", kpi_val),
                Paragraph(f"${kpis.total_purchase_amount:,.2f}", kpi_val),
                Paragraph(f"${kpis.avg_purchase_amount:.2f}", kpi_val),
                Paragraph(f"{kpis.avg_review_rating:.2f} / 5", kpi_val),
                Paragraph(f"{kpis.total_records:,}", kpi_val),
            ],
        ]
        kpi_table = Table(kpi_cells, colWidths=[108, 108, 108, 108, 108])
        kpi_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), c_light_bg),
                    ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )
        elements.append(kpi_table)
        elements.append(Spacer(1, 14))

        # 3. Category Breakdown Table
        elements.append(Paragraph("Category Performance & Spending Breakdown", h1_style))
        patterns_data = AnalyticsService.calculate_shopping_patterns(df)
        cat_info = patterns_data.category_sales

        cat_rows = [["Category", "Total Spend ($)", "Transactions", "Avg Spend ($)", "Avg Rating"]]
        for i in range(len(cat_info["categories"])):
            cat_rows.append([
                cat_info["categories"][i],
                f"${cat_info['total_spend'][i]:,.2f}",
                f"{cat_info['record_count'][i]:,}",
                f"${cat_info['avg_spend'][i]:.2f}",
                f"{cat_info['avg_rating'][i]:.2f}" if i < len(cat_info.get("avg_rating", [])) else "N/A",
            ])

        cat_table = Table(cat_rows, colWidths=[140, 100, 100, 100, 100])
        cat_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), c_primary),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
                ]
            )
        )
        elements.append(cat_table)
        elements.append(Spacer(1, 14))

        # 4. Customer Demographics Section
        elements.append(Paragraph("Customer Demographics (Age & Gender Distribution)", h1_style))
        cust_data = AnalyticsService.calculate_customers(df)
        age_summary = cust_data.age_group_summary_table

        demo_rows = [["Age Group", "Customers", "% Share", "Total Spend ($)", "Avg Spend ($)", "Sub. Rate %"]]
        for row in age_summary:
            demo_rows.append([
                row["age_group"],
                f"{row['customer_count']:,}",
                f"{row['pct_of_total']}%",
                f"${row['total_spend']:,.2f}",
                f"${row['avg_spend']:.2f}",
                f"{row['subscription_rate']}%",
            ])

        demo_table = Table(demo_rows, colWidths=[90, 80, 80, 100, 95, 95])
        demo_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), c_purple),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                    ("TOPPADDING", (0, 0), (-1, -1), 5),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
                ]
            )
        )
        elements.append(demo_table)
        elements.append(Spacer(1, 14))

        # 5. Top 10 Best Selling Items Table
        elements.append(Paragraph("Top 10 Products by Purchase Volume", h1_style))
        item_rows = [["Rank", "Product Name", "Category", "Total Spend ($)", "Transactions", "Avg Spend ($)"]]
        for item in patterns_data.items_ranking_table[:10]:
            item_rows.append([
                f"#{item['rank']}",
                item["item"],
                item["category"],
                f"${item['total_spend']:,.2f}",
                f"{item['purchase_count']:,}",
                f"${item['avg_spend']:.2f}",
            ])

        item_table = Table(item_rows, colWidths=[40, 140, 100, 90, 85, 85])
        item_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E293B")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
                    ("TOPPADDING", (0, 0), (-1, -1), 4.5),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_light_bg]),
                ]
            )
        )
        elements.append(item_table)
        elements.append(Spacer(1, 14))

        # 6. Key Data-Driven Insights
        elements.append(Paragraph("Strategic Business Insights", h1_style))
        for ins in (cust_data.insights + patterns_data.insights)[:5]:
            bullet_p = Paragraph(f"&bull; {ins}", body_style)
            elements.append(bullet_p)
            elements.append(Spacer(1, 3))

        elements.append(Spacer(1, 10))

        # 7. Methodological Note & Analytical Restrictions
        elements.append(
            KeepTogether(
                [
                    Paragraph("Analytical Notes & Limitations", ParagraphStyle("H2", parent=h1_style, fontSize=11)),
                    Paragraph(
                        "<b>Data Truth & Integrity:</b> All metrics displayed in this report are authoritatively calculated "
                        "from the active dataset without simulation. The dataset contains 3,900 customer records across 18 "
                        "attributes.<br/>"
                        "<b>Temporal Limitation:</b> The source dataset does not contain transaction date timestamps. Consequently, "
                        "daily, weekly, monthly, or historical revenue time-series are intentionally omitted to prevent fabricated trends. "
                        "The 'Season' field is treated solely as an independent categorical attribute.<br/>"
                        "<b>Revenue Definition:</b> The metric 'Total Purchase Amount' represents the aggregate of recorded transaction values, "
                        "not verified audited enterprise revenue.",
                        ParagraphStyle("Disc", parent=body_style, fontSize=8, leading=11, textColor=c_muted),
                    ),
                ]
            )
        )

        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()

    @staticmethod
    def generate_cleaned_csv(df: pd.DataFrame) -> bytes:
        return df.to_csv(index=False).encode("utf-8")

    @staticmethod
    def generate_summary_csv(df: pd.DataFrame) -> bytes:
        output = io.StringIO()
        
        # 1. Executive KPIs
        dash = AnalyticsService.calculate_dashboard(df, {})
        k = dash.kpis
        output.write("=== EXECUTIVE METRICS SUMMARY ===\n")
        output.write(f"Total Customers,{k.total_customers}\n")
        output.write(f"Total Purchase Amount (USD),{k.total_purchase_amount}\n")
        output.write(f"Average Purchase Amount (USD),{k.avg_purchase_amount}\n")
        output.write(f"Average Review Rating,{k.avg_review_rating}\n")
        output.write(f"Total Purchase Records,{k.total_records}\n")
        output.write(f"Subscription Adoption Rate (%),{k.subscription_rate_pct}\n")
        output.write(f"Average Previous Purchases,{k.avg_previous_purchases}\n")
        output.write(f"Top Category,{k.top_category}\n")
        output.write(f"Top Location,{k.top_location}\n")
        output.write(f"Top Payment Method,{k.top_payment_method}\n")
        output.write(f"Top Shipping Type,{k.top_shipping_type}\n\n")

        # 2. Category Performance
        output.write("=== CATEGORY PERFORMANCE ===\n")
        patterns = AnalyticsService.calculate_shopping_patterns(df)
        cat_df = pd.DataFrame(patterns.category_sales)
        cat_df.to_csv(output, index=False)
        output.write("\n")

        # 3. Age Group Demographics
        output.write("=== CUSTOMER AGE GROUP DEMOGRAPHICS ===\n")
        cust = AnalyticsService.calculate_customers(df)
        age_df = pd.DataFrame(cust.age_group_summary_table)
        age_df.to_csv(output, index=False)
        output.write("\n")

        # 4. Product Rankings (All 25 Items)
        output.write("=== PRODUCT RANKINGS BY REVENUE ===\n")
        items_df = pd.DataFrame(patterns.items_ranking_table)
        items_df.to_csv(output, index=False)

        return output.getvalue().encode("utf-8")
