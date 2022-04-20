import { Box } from '@mui/material'
import React from 'react'

const UserListItem = ({user, handleFunction}) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        width: "100%",
        backgroundColor: "#E8E8E8",
        '&:hover': {
          backgroundColor: "#38B2AC",
          color: "white",
        },
      }}
    >
        <span>{user.name}</span>
        <span>{user.email}</span>
    </Box>
  )
}

export default UserListItem