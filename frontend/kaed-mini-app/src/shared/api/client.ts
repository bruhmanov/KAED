const API_URL =
  process.env.API_URL || ''

export async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',

        ...(options?.headers ||
          {}),
      },

      ...options,
    }
  )

  if (!response.ok) {
    let errorMessage =
      `API Error: ${response.status}`

    try {
      const errorData =
        await response.json()

      if (
        errorData?.message
      ) {
        errorMessage =
          errorData.message
      }
    } catch {
      // ignore
    }

    console.error(
      '[API ERROR]',
      errorMessage
    )

    throw new Error(
      errorMessage
    )
  }

  if (
    response.status === 204
  ) {
    return undefined as T
  }

  const contentType =
    response.headers.get(
      'content-type'
    )

  if (
    !contentType?.includes(
      'application/json'
    )
  ) {
    return undefined as T
  }

  return response.json()
}