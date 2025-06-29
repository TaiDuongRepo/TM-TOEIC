# System Design - TM TOEIC Platform

## Kiến trúc tổng quan
- Frontend: Next.js 14 với App Router
- UI Framework: Tailwind CSS + shadcn/ui
- Database: PostgreSQL với Prisma ORM
- File Storage: MinIO

## Cải tiến Audio Player

### Component Design
```
AudioPlayer/
├── AudioPlayer.tsx (Main component)
├── AudioControls.tsx (Play/Pause/Stop buttons)
├── VolumeControl.tsx (Volume slider)
├── ProgressBar.tsx (Time progress)
└── TimeDisplay.tsx (Current/Total time)
```

### Features
1. **Play/Pause**: Toggle phát/dừng âm thanh
2. **Stop**: Dừng và reset về đầu
3. **Volume Control**: Điều chỉnh âm lượng (0-100%)
4. **Progress Bar**: Hiển thị tiến độ và cho phép seek
5. **Time Display**: Hiển thị thời gian hiện tại/tổng
6. **Keyboard Shortcuts**: 
   - Space: Play/Pause
   - Arrow Left/Right: Seek ±5s
   - Arrow Up/Down: Volume ±10%

### State Management
- `isPlaying`: Trạng thái phát/dừng
- `currentTime`: Thời gian hiện tại
- `duration`: Tổng thời gian
- `volume`: Âm lượng (0-1)
- `isLoading`: Trạng thái tải

### Integration
- Tích hợp vào `parts/[id]/page.tsx`
- Thay thế button phát âm thanh đơn giản hiện tại
- Responsive design cho mobile/desktop 