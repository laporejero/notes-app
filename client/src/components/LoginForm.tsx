import { useEffect, type JSX } from 'react'
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    Alert
} from '@mui/material'

type LoginFormProps = {
    handleLogin: (v: any) => void
    username: string
    password: string
    setUsername: (v: string) => void
    setPassword: (v: string) => void
    loginErr: string|null
    setLoginErr: (v: string|null) => void
} 

function LoginForm({ handleLogin, username, password, setUsername, setPassword, loginErr, setLoginErr }:LoginFormProps): JSX.Element {
    useEffect(() => {
        if (!loginErr) return
        const timer = setTimeout(() => {
            setLoginErr(null)
        }, 5000)

        return () => clearTimeout(timer)
    }, [loginErr])

    return (
        <Box 
            component="form"
            onSubmit={handleLogin}
            sx={{
            minHeight: "100vh",
            bgcolor: "#191919",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
        }}>
            <Paper
                elevation={0}
                sx={{
                    width: 400,
                    bgcolor: "#191919",
                    border: "1px solid rgb(50,50,50)",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
            >
                <Stack spacing={3}>
                    <Typography
                        variant="h3"
                        sx={{
                            color: "rgb(232,232,232)",
                            fontSize: "var(--text-h3)",
                            fontWeight: "var(--font-weight-bold)",
                            fontFamily: "var(--font-family)",
                            letterSpacing: "var(--letter-spacing-tight)",
                            lineHeight: "var(--line-height-tight)",
                            textAlign: "center",
                        }}
                    >
                        Notes App
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "rgb(165,165,165)",
                            textAlign: "center",
                            mt: -1,
                            fontSize: "var(--text-base)"
                        }}
                    >
                        Sign in to access your notes.
                    </Typography>
                    <TextField
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}

                        label="Username"
                        variant="outlined"
                        autoComplete="username"
                        fullWidth
                        required
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                color: "rgb(232,232,232)",

                                "& fieldset": {
                                borderColor: "rgb(80,80,80)",
                                },

                                "&:hover fieldset": {
                                borderColor: "rgb(165,165,165)",
                                },

                                "&.Mui-focused fieldset": {
                                borderColor: "rgb(232,232,232)",
                                },
                                fontSize: "var(--text-base)"
                            },

                            "& .MuiInputLabel-root": {
                                color: "rgb(165,165,165)",
                                fontSize: "var(--text-base)"
                            },

                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "rgb(232,232,232)",
                            },
                        }}
                    />
                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                        label="Password"
                        type="password"
                        variant="outlined"
                        autoComplete="current-password"
                        fullWidth
                        required
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            color: "rgb(232,232,232)",

                            "& fieldset": {
                            borderColor: "rgb(80,80,80)",
                            },

                            "&:hover fieldset": {
                            borderColor: "rgb(165,165,165)",
                            },

                            "&.Mui-focused fieldset": {
                            borderColor: "rgb(232,232,232)",
                            },
                            fontSize: "var(--text-base)"
                        },

                        "& .MuiInputLabel-root": {
                            color: "rgb(165,165,165)",
                            fontSize: "var(--text-base)"
                        },

                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "rgb(232,232,232)",
                        },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        size="large"
                        sx={{
                            color: "rgb(232,232,232)",
                            borderColor: "rgb(165,165,165)",
                            py: 1.2,
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "var(--text-base)",

                            "&:hover": {
                                bgcolor: "rgb(232,232,232)",
                                color: "#191919",
                                borderColor: "rgb(232,232,232)",
                            },
                        }}
                    >
                        Sign In
                    </Button>
                    {loginErr && (
                        <Alert 
                            severity='error'
                            sx={{ fontSize: "var(--text-base)" }}
                        >
                            {loginErr}
                        </Alert>
                        )}
                </Stack>
            </Paper>
        </Box>
    )
}

export default LoginForm