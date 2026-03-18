export default function AdminReports() {
  return (
    <div className="p-4 sm:p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tablero de Power BI con estadísticas del sistema</p>
      </div>
      <div className="card overflow-hidden">
        <div className="w-full" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
          <iframe
            title="Cartagena Segura - Power BI"
            src="https://app.powerbi.com/view?r=eyJrIjoiYTY3OTc3ZGYtNjMzMi00OGFlLWE4ZWQtYTQyNmMxZGM1NjcxIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  )
}
