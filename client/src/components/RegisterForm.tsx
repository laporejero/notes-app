import { useState, useEffect, type JSX } from 'react'
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'

type RegisterFormProps = {
    onRegister: (username:string, name:string, password:string) => void
    goToLogin: () => void
}

const RegisterForm = ({ onRegister, goToLogin }: RegisterFormProps): JSX.Element => {
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [registerErr, setRegisterErr] = useState<string|null>(null)

    const submit = async (event:any) => {
        event.preventDefault()

        try {
            await onRegister(username, name, password)

            setUsername('')
            setName('')
            setPassword('')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setRegisterErr(error.response?.data?.error ?? 'Unable to create account.')
            } else {
                setRegisterErr('Something went wrong')
            }
        }
    }

    useEffect(() => {
        if (!registerErr) return

        const timer = setTimeout(() => {
        setRegisterErr(null)
        }, 5000)

        return () => clearTimeout(timer)
    }, [registerErr])

    return (
        <Box
            component="form"
            onSubmit={submit}
            sx={{
                minHeight: '100vh',
                bgcolor: '#191919',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                width: 400,
                bgcolor: '#191919',
                border: '1px solid rgb(50,50,50)',
                borderRadius: 2,
                p: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
            >
                <Stack spacing={3}>
                    <Typography
                        variant="h3"
                        sx={{
                        color: 'rgb(232,232,232)',
                        fontSize: 'var(--text-h3)',
                        fontWeight: 'var(--font-weight-bold)',
                        fontFamily: 'var(--font-family)',
                        letterSpacing: 'var(--letter-spacing-tight)',
                        lineHeight: 'var(--line-height-tight)',
                        textAlign: 'center',
                        }}
                    >
                        Create Account
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                        color: 'rgb(165,165,165)',
                        textAlign: 'center',
                        mt: -1,
                        fontSize: 'var(--text-base)',
                        }}
                    >
                        Create an account to start saving your notes.
                    </Typography>

                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        label="Name"
                        variant="outlined"
                        autoComplete="name"
                        fullWidth
                        required
                        sx={textFieldStyles}
                    />

                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        label="Username"
                        variant="outlined"
                        autoComplete="username"
                        fullWidth
                        required
                        sx={textFieldStyles}
                    />

                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password"
                        type="password"
                        variant="outlined"
                        autoComplete="new-password"
                        fullWidth
                        required
                        sx={textFieldStyles}
                    />

                    <Button
                        type="submit"
                        variant="outlined"
                        size="large"
                        sx={{
                        color: 'rgb(232,232,232)',
                        borderColor: 'rgb(165,165,165)',
                        py: 1.2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: 'var(--text-base)',

                        '&:hover': {
                            bgcolor: 'rgb(232,232,232)',
                            color: '#191919',
                            borderColor: 'rgb(232,232,232)',
                        },
                        }}
                    >
                        Register
                    </Button>

                    {registerErr && (
                        <Alert
                        severity="error"
                        sx={{
                            fontSize: 'var(--text-base)',
                        }}
                        >
                        {registerErr}
                        </Alert>
                    )}

                    <Typography
                        sx={{
                            color: "rgb(165,165,165)",
                            textAlign: "center",
                            fontSize: "var(--text-base)"
                        }}
                        >
                        Already have an account?
                        <Button
                            onClick={goToLogin}
                            sx={{ 
                                textTransform: "none",
                                fontSize: "var(--text-base)",
                                minWidth: 0,
                                p: 0,
                                ml: 0.5,

                                "&:hover": {
                                    backgroundColor: "transparent",
                                    color: "rgb(165,165,165)",
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    )
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: 'rgb(232,232,232)',

    '& fieldset': {
      borderColor: 'rgb(80,80,80)',
    },

    '&:hover fieldset': {
      borderColor: 'rgb(165,165,165)',
    },

    '&.Mui-focused fieldset': {
      borderColor: 'rgb(232,232,232)',
    },

    fontSize: 'var(--text-base)',
  },

  '& .MuiInputLabel-root': {
    color: 'rgb(165,165,165)',
    fontSize: 'var(--text-base)',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: 'rgb(232,232,232)',
  },
}

export default RegisterForm