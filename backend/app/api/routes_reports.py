from fastapi import APIRouter, HTTPException, Response
from app.services.dataset_manager import DatasetManager
from app.services.report_service import ReportService

router = APIRouter(prefix="/api", tags=["Reports & Exports"])


@router.get("/reports/pdf")
def download_pdf_report(use_cleaned: bool = True):
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=use_cleaned)
        pdf_bytes = ReportService.generate_pdf_report(
            df=df,
            dataset_name=manager.filename,
            is_cleaned=use_cleaned and manager.is_cleaned,
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=retail_analytics_{manager.filename.replace('.csv', '')}.pdf"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")


@router.get("/exports/cleaned-csv")
def export_cleaned_csv():
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=True)
        csv_bytes = ReportService.generate_cleaned_csv(df)
        return Response(
            content=csv_bytes,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=cleaned_{manager.filename}"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export cleaned CSV: {str(e)}")


@router.get("/exports/summary-csv")
def export_summary_csv(use_cleaned: bool = True):
    try:
        manager = DatasetManager.get_instance()
        df = manager.get_df(use_cleaned=use_cleaned)
        csv_bytes = ReportService.generate_summary_csv(df)
        return Response(
            content=csv_bytes,
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=summary_analytics.csv"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export summary CSV: {str(e)}")
