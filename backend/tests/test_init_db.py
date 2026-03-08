import pytest
import psycopg2
from unittest.mock import patch, mock_open

from init_db import init_db

@patch('init_db.Config')
@patch('init_db.psycopg2.connect')
@patch('builtins.open', new_callable=mock_open, read_data="CREATE TABLE fake_table (id INT);")
def test_init_db_success(mock_file, mock_connect, mock_config):
    mock_conn = mock_connect.return_value
    mock_cur = mock_conn.cursor.return_value

    init_db()

    mock_file.assert_called_once()

    mock_cur.execute.assert_called_once_with("CREATE TABLE fake_table (id INT);")
    
    mock_conn.commit.assert_called_once()
    mock_cur.close.assert_called_once()
    mock_conn.close.assert_called_once()
    mock_conn.rollback.assert_not_called()

@patch('init_db.Config')
@patch('init_db.psycopg2.connect')
@patch('builtins.open', new_callable=mock_open, read_data="BAD SQL")
def test_init_db_psycopg2_error(mock_file, mock_connect, mock_config):
    mock_conn = mock_connect.return_value
    mock_cur = mock_conn.cursor.return_value

    mock_cur.execute.side_effect = psycopg2.Error("Fake DB Crash")

    init_db()

    mock_conn.rollback.assert_called_once()
    mock_conn.commit.assert_not_called()

    mock_cur.close.assert_called_once()
    mock_conn.close.assert_called_once()

@patch('init_db.Config')
@patch('init_db.psycopg2.connect')
@patch('builtins.open')
def test_init_db_os_error(mock_file, mock_connect, mock_config):
    mock_conn = mock_connect.return_value
    mock_cur = mock_conn.cursor.return_value

    mock_file.side_effect = OSError("File not found")

    init_db()

    mock_conn.rollback.assert_called_once()
    mock_conn.commit.assert_not_called()
    mock_cur.close.assert_called_once()
    mock_conn.close.assert_called_once()
