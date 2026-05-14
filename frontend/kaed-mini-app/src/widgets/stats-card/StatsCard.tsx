import Card from '../../shared/ui/Card'

interface Props {
  title: string

  value:
    | string
    | number

  subtitle?: string

  onClick?: () => void
}

export default function StatsCard({
  title,
  value,
  subtitle,
  onClick,
}: Props) {
  return (
    <Card onClick={onClick}>
      <div className="text-muted text-sm">
        {title}
      </div>

      <div className="text-3xl font-bold mt-3">
        {value}
      </div>

      {subtitle && (
        <div className="text-muted text-sm mt-2">
          {subtitle}
        </div>
      )}
    </Card>
  )
}