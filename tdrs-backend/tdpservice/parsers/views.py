"""Views for the parsers app."""
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializers import ParsingErrorSerializer
from .models import ParserError
import logging
import base64
from io import BytesIO
import xlsxwriter

logger = logging.getLogger()


class ParsingErrorViewSet(ModelViewSet):
    """Data file views."""

    queryset = ParserError.objects.all()
    serializer_class = ParsingErrorSerializer

    def list(self, request, *args, **kwargs):
        """Override list to return xls file."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(self._get_xls_serialized_file(serializer.data))

    def get_queryset(self):
        """Override get_queryset to filter by request url."""
        queryset = ParserError.objects.all()
        id = self.request.query_params.get('id', None)
        if id is not None:
            queryset = queryset.filter(id=id)
        return queryset

    def _get_xls_serialized_file(self, data):
        """Return xls file created from the error."""
        row, col = 0, 0
        output = BytesIO()
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet()

        for i in data:
            row += 1
            col = 0
            for key, value in i.items():
                worksheet.write(0, col, key)
                worksheet.write(row, col, value)
                col += 1
        workbook.close()
        return {"data": data, "xls_report": base64.b64encode(output.getvalue()).decode("utf-8")}
