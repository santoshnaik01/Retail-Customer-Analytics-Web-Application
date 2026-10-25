import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.dataset_manager import DatasetManager

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_dataset():
    # Ensure default dataset is loaded and cleaned before tests
    manager = DatasetManager.get_instance()
    manager._initialize_default()
    manager.run_cleaning()


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert data["dataset_loaded"] is True
    assert data["records_count"] == 3900


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["dataset_loaded"] is True
    assert data["row_count"] == 3900


def test_dataset_summary():
    response = client.get("/api/dataset/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["row_count"] == 3900
    assert data["column_count"] == 18
    assert "categories" in data["available_filters"]
    assert len(data["columns"]) == 18


def test_dataset_quality():
    response = client.get("/api/dataset/quality")
    assert response.status_code == 200
    data = response.json()
    assert "missing_values" in data
    assert data["health_score"] >= 90.0
    assert "duplicate_rows" in data


def test_clean_dataset_endpoint():
    payload = {
        "impute_missing_rating": True,
        "imputation_strategy": "category_mean",
        "trim_whitespace": True,
        "remove_duplicates": True,
    }
    response = client.post("/api/dataset/clean", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["records_after"] == 3900
    assert data["missing_after"] == 0
    assert len(data["operations_log"]) > 0


def test_dashboard_kpis_and_charts():
    payload = {"use_cleaned": True}
    response = client.post("/api/dashboard", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    kpis = data["kpis"]
    assert kpis["total_customers"] == 3900
    assert kpis["total_records"] == 3900
    assert kpis["total_purchase_amount"] > 200000
    assert 3.5 <= kpis["avg_review_rating"] <= 4.0
    assert kpis["top_category"] == "Clothing"

    # Category chart
    assert len(data["purchase_by_category"]["categories"]) == 4
    assert "Clothing" in data["purchase_by_category"]["categories"]

    # Gender distribution
    assert len(data["customer_distribution_gender"]["labels"]) == 2
    assert "Male" in data["customer_distribution_gender"]["labels"]

    # Top products (horizontal bar chart: 5 products)
    assert len(data["top_products"]["products"]) == 5

    # 4 Key insights
    assert len(data["insights"]) == 4


def test_dashboard_with_filters():
    # Filter by Clothing and Male
    payload = {
        "category": "Clothing",
        "gender": "Male",
        "use_cleaned": True,
    }
    response = client.post("/api/dashboard", json=payload)
    assert response.status_code == 200
    data = response.json()
    kpis = data["kpis"]
    assert kpis["total_records"] < 3900
    assert kpis["total_records"] > 0
    # All records in category chart should be Clothing
    assert data["purchase_by_category"]["categories"] == ["Clothing"]


def test_customer_analytics():
    payload = {"use_cleaned": True}
    response = client.post("/api/analytics/customers", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["age_distribution"]["groups"]) == 5
    assert len(data["gender_distribution"]["labels"]) == 2
    assert len(data["location_distribution"]["locations"]) == 10
    assert len(data["age_group_summary_table"]) == 5
    assert len(data["insights"]) >= 3


def test_shopping_patterns():
    payload = {"use_cleaned": True}
    response = client.post("/api/analytics/shopping-patterns", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["category_sales"]["categories"]) == 4
    assert len(data["top_items"]["items"]) == 10
    assert len(data["payment_methods"]["methods"]) == 6
    assert len(data["shipping_types"]["types"]) == 6
    assert len(data["size_distribution"]["sizes"]) == 4
    assert len(data["items_ranking_table"]) == 25  # All 25 products
    assert len(data["insights"]) >= 2


def test_data_explorer_pagination_and_search():
    # Page 1, size 10
    payload = {
        "page": 1,
        "page_size": 10,
        "search_query": None,
        "sort_column": "Customer ID",
        "sort_direction": "asc",
        "use_cleaned": True,
    }
    response = client.post("/api/dataset/data", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_rows"] == 3900
    assert len(data["rows"]) == 10
    assert data["total_pages"] == 390
    assert data["rows"][0]["Customer ID"] == 1

    # Search for a specific item
    payload["search_query"] = "Handbag"
    response = client.post("/api/dataset/data", json=payload)
    assert response.status_code == 200
    search_data = response.json()
    assert search_data["total_rows"] > 0
    assert search_data["total_rows"] < 3900


def test_upload_validation_errors():
    # 1. Unsupported extension
    invalid_file = ("test.txt", b"some text", "text/plain")
    response = client.post("/api/upload", files={"file": invalid_file})
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]

    # 2. Empty file
    empty_file = ("empty.csv", b"", "text/csv")
    response = client.post("/api/upload", files={"file": empty_file})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_report_downloads():
    # 1. PDF Report
    pdf_resp = client.get("/api/reports/pdf")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert pdf_resp.content.startswith(b"%PDF")
    assert len(pdf_resp.content) > 1000

    # 2. Cleaned CSV
    csv_resp = client.get("/api/exports/cleaned-csv")
    assert csv_resp.status_code == 200
    assert "Customer ID" in csv_resp.text
    assert len(csv_resp.text.splitlines()) == 3901

    # 3. Summary CSV
    summary_resp = client.get("/api/exports/summary-csv")
    assert summary_resp.status_code == 200
    assert "EXECUTIVE METRICS SUMMARY" in summary_resp.text
    assert "Total Customers,3900" in summary_resp.text
