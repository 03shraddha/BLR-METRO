import { useState, useCallback, useRef } from 'react'
import MapContainer from './components/MapContainer'
import LayerTabs from './components/LayerTabs'
import TimeSlider from './components/TimeSlider'
import WeekdayToggle from './components/WeekdayToggle'
import OdFlowControls from './components/OdFlowControls'
import DataTable from './components/DataTable'
import Tooltip from './components/Tooltip'
import Legend from './components/Legend'
import StationPanel from './components/StationPanel'
import { useMetroData } from './hooks/useMetroData'
import { useTimeSlider } from './hooks/useTimeSlider'

export default function App() {
  const { data, loading, error } = useMetroData()
  const { hour, playing, togglePlay, setHourManual } = useTimeSlider(8)

  const [activeLayer, setActiveLayer] = useState('volume')
  const [weekdayWeekendMode, setWeekdayWeekendMode] = useState('weekday')
  const [odTopN, setOdTopN] = useState(15)
  const [tooltipInfo, setTooltipInfo] = useState(null)
  const [selectedStation, setSelectedStation] = useState(null)
  const [zoom, setZoom] = useState(11.2)

  const handleZoomChange = useCallback(z => setZoom(z), [])

  const handleHover = useCallback(info => {
    setTooltipInfo(info.object ? info : null)
  }, [])

  const handleStationClick = useCallback(station => {
    setSelectedStation(prev =>
      prev?.properties?.id === station.properties?.id ? null : station
    )
  }, [])

  const handleClosePanel = useCallback(() => setSelectedStation(null), [])

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-white/60 text-sm text-center px-8">
          <div className="text-2xl mb-3">⚠</div>
          <div>Could not load metro data.</div>
          <div className="text-white/30 text-xs mt-2">{error}</div>
          <div className="text-white/30 text-xs mt-1">
            Run scripts/process_data.py first to generate the data files.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0f]">
      {/* Base map + deck.gl layers */}
      {!loading && data && (
        <MapContainer
          data={data}
          activeLayer={activeLayer}
          hour={hour}
          playing={playing}
          weekdayWeekendMode={weekdayWeekendMode}
          zoom={zoom}
          odTopN={odTopN}
          onHover={handleHover}
          onStationClick={handleStationClick}
          onZoomChange={handleZoomChange}
        />
      )}

      {/* Loading overlay when data is still fetching */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-xs tracking-widest uppercase">
            Loading data…
          </div>
        </div>
      )}

      {/* Layer story chapter tabs */}
      <LayerTabs activeLayer={activeLayer} setActiveLayer={setActiveLayer} />

      {/* Weekday / weekend / delta / compare sub-toggle */}
      <WeekdayToggle
        mode={weekdayWeekendMode}
        setMode={setWeekdayWeekendMode}
        activeLayer={activeLayer}
      />

      {/* Data table — adapts to whichever layer is active */}
      <DataTable
        data={data}
        activeLayer={activeLayer}
        hour={hour}
        weekdayWeekendMode={weekdayWeekendMode}
        odTopN={odTopN}
        selectedStation={selectedStation}
        onStationClick={handleStationClick}
      />

      {/* OD flow top-N slider */}
      <OdFlowControls
        topN={odTopN}
        setTopN={setOdTopN}
        activeLayer={activeLayer}
      />

      {/* Time slider (only for hourly layers) */}
      <TimeSlider
        hour={hour}
        playing={playing}
        togglePlay={togglePlay}
        setHourManual={setHourManual}
        activeLayer={activeLayer}
      />

      {/* Legend */}
      <Legend activeLayer={activeLayer} weekdayWeekendMode={weekdayWeekendMode} />

      {/* Hover tooltip */}
      <Tooltip info={tooltipInfo} hour={hour} />

      {/* Station detail panel */}
      <StationPanel station={selectedStation} onClose={handleClosePanel} />

      {/* Title watermark — hidden behind weekday toggle */}
      {activeLayer !== 'weekdayWeekend' && (
        <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
          <div className="text-white/20 text-[10px] tracking-widest uppercase">
            Bengaluru Metro
          </div>
          <div className="text-white/10 text-[9px]">Intelligence Map</div>
        </div>
      )}
    </div>
  )
}
